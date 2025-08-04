# Message Queues and Event-Driven Architecture - Building Resilient Communication

## 🌟 Real-World Story: The Modern Restaurant Kitchen

Imagine running a busy restaurant with multiple stations, delivery services, and customer orders. You need the same communication patterns as distributed systems:

- **Order Queue** (Message Queue): Orders line up to be processed by available chefs
- **Kitchen Stations** (Microservices): Each station specializes in different dishes
- **Order Tickets** (Events): Information flows between stations as dishes progress
- **Expediter** (Event Bus): Coordinates between kitchen, servers, and delivery
- **Backup Kitchen** (Dead Letter Queue): Handles orders that can't be completed
- **Rush Hour Management** (Load Balancing): Distributes work during peak times
- **Quality Control** (Message Acknowledgment): Ensures every order is completed correctly

Just like a well-orchestrated restaurant, event-driven systems enable loose coupling, scalability, and resilience through asynchronous communication!

## 🎯 Why Message Queues Matter

### Real Applications:
- **Netflix**: Processes 1+ billion events daily for recommendations and analytics
- **Uber**: Handles millions of ride requests through event-driven microservices
- **Amazon**: Uses SQS and SNS for decoupling services across AWS infrastructure
- **Spotify**: Streams music metadata and user interactions through Kafka

## 📊 Event-Driven System Components

### 📬 Message Queue Fundamentals
### 🚌 Event Bus and Pub/Sub Patterns
### ⚡ Stream Processing Systems
### 🔄 Event Sourcing and CQRS
### 🛡️ Reliability and Error Handling

---

## 📬 MESSAGE QUEUE FUNDAMENTALS

### What are Message Queues?
**Real-World Analogy**: Like a post office system - messages are placed in mailboxes (queues), postal workers (consumers) pick them up when available, and delivery confirmation ensures nothing gets lost.

```cpp
// Message Queue Implementation
#include <queue>
#include <thread>
#include <condition_variable>
#include <chrono>
#include <atomic>
#include <functional>

// Message structure
template<typename T>
struct Message {
    string messageId;
    T payload;
    chrono::system_clock::time_point timestamp;
    int retryCount;
    chrono::system_clock::time_point visibilityTimeout;
    map<string, string> attributes;
    
    Message(const string& id, const T& data) 
        : messageId(id), payload(data), timestamp(chrono::system_clock::now()), 
          retryCount(0), visibilityTimeout(chrono::system_clock::now()) {}
};

// Basic Message Queue
template<typename T>
class MessageQueue {
private:
    queue<Message<T>> messages;
    mutable mutex queueMutex;
    condition_variable queueCondition;
    
    // Configuration
    size_t maxQueueSize;
    chrono::seconds visibilityTimeoutDuration;
    int maxRetries;
    
    // Statistics
    atomic<int> totalMessages{0};
    atomic<int> processedMessages{0};
    atomic<int> failedMessages{0};
    
public:
    MessageQueue(size_t maxSize = 1000, chrono::seconds timeout = chrono::seconds(30), int retries = 3)
        : maxQueueSize(maxSize), visibilityTimeoutDuration(timeout), maxRetries(retries) {}
    
    bool enqueue(const string& messageId, const T& payload, const map<string, string>& attributes = {}) {
        unique_lock<mutex> lock(queueMutex);
        
        if (messages.size() >= maxQueueSize) {
            cout << "Queue full, cannot enqueue message: " << messageId << endl;
            return false;
        }
        
        Message<T> message(messageId, payload);
        message.attributes = attributes;
        
        messages.push(message);
        totalMessages++;
        
        cout << "Enqueued message: " << messageId << " (Queue size: " << messages.size() << ")" << endl;
        
        queueCondition.notify_one();
        return true;
    }
    
    bool dequeue(Message<T>& message, chrono::milliseconds timeout = chrono::milliseconds(1000)) {
        unique_lock<mutex> lock(queueMutex);
        
        if (!queueCondition.wait_for(lock, timeout, [this] { return !messages.empty(); })) {
            return false; // Timeout
        }
        
        message = messages.front();
        messages.pop();
        
        // Set visibility timeout
        message.visibilityTimeout = chrono::system_clock::now() + visibilityTimeoutDuration;
        
        cout << "Dequeued message: " << message.messageId << endl;
        return true;
    }
    
    void acknowledgeMessage(const string& messageId) {
        processedMessages++;
        cout << "Acknowledged message: " << messageId << endl;
    }
    
    void rejectMessage(const Message<T>& message) {
        unique_lock<mutex> lock(queueMutex);
        
        Message<T> retryMessage = message;
        retryMessage.retryCount++;
        
        if (retryMessage.retryCount <= maxRetries) {
            messages.push(retryMessage);
            cout << "Requeued message: " << message.messageId << " (Retry: " << retryMessage.retryCount << ")" << endl;
        } else {
            failedMessages++;
            cout << "Message failed permanently: " << message.messageId << " (Max retries exceeded)" << endl;
        }
        
        queueCondition.notify_one();
    }
    
    size_t size() const {
        lock_guard<mutex> lock(queueMutex);
        return messages.size();
    }
    
    void displayStats() const {
        cout << "\n=== Message Queue Statistics ===" << endl;
        cout << "Current Queue Size: " << size() << endl;
        cout << "Total Messages: " << totalMessages.load() << endl;
        cout << "Processed Messages: " << processedMessages.load() << endl;
        cout << "Failed Messages: " << failedMessages.load() << endl;
        cout << "Success Rate: " << (double)processedMessages.load() / totalMessages.load() * 100 << "%" << endl;
    }
};

// Priority Message Queue
template<typename T>
class PriorityMessageQueue {
private:
    struct PriorityMessage {
        Message<T> message;
        int priority;
        
        PriorityMessage(const Message<T>& msg, int prio) : message(msg), priority(prio) {}
        
        bool operator<(const PriorityMessage& other) const {
            return priority < other.priority; // Higher priority first
        }
    };
    
    priority_queue<PriorityMessage> messages;
    mutable mutex queueMutex;
    condition_variable queueCondition;
    
    size_t maxQueueSize;
    atomic<int> totalMessages{0};
    
public:
    PriorityMessageQueue(size_t maxSize = 1000) : maxQueueSize(maxSize) {}
    
    bool enqueue(const string& messageId, const T& payload, int priority = 0) {
        unique_lock<mutex> lock(queueMutex);
        
        if (messages.size() >= maxQueueSize) {
            cout << "Priority queue full, cannot enqueue message: " << messageId << endl;
            return false;
        }
        
        Message<T> message(messageId, payload);
        messages.emplace(message, priority);
        totalMessages++;
        
        cout << "Enqueued priority message: " << messageId << " (Priority: " << priority << ")" << endl;
        
        queueCondition.notify_one();
        return true;
    }
    
    bool dequeue(Message<T>& message, chrono::milliseconds timeout = chrono::milliseconds(1000)) {
        unique_lock<mutex> lock(queueMutex);
        
        if (!queueCondition.wait_for(lock, timeout, [this] { return !messages.empty(); })) {
            return false;
        }
        
        message = messages.top().message;
        int priority = messages.top().priority;
        messages.pop();
        
        cout << "Dequeued priority message: " << message.messageId << " (Priority: " << priority << ")" << endl;
        return true;
    }
    
    size_t size() const {
        lock_guard<mutex> lock(queueMutex);
        return messages.size();
    }
};

// Dead Letter Queue
template<typename T>
class DeadLetterQueue {
private:
    vector<Message<T>> deadMessages;
    mutable mutex dlqMutex;
    
public:
    void addDeadMessage(const Message<T>& message, const string& reason) {
        lock_guard<mutex> lock(dlqMutex);
        
        Message<T> deadMessage = message;
        deadMessage.attributes["failure_reason"] = reason;
        deadMessage.attributes["failed_at"] = to_string(chrono::system_clock::now().time_since_epoch().count());
        
        deadMessages.push_back(deadMessage);
        
        cout << "Added message to DLQ: " << message.messageId << " (Reason: " << reason << ")" << endl;
    }
    
    vector<Message<T>> getDeadMessages() const {
        lock_guard<mutex> lock(dlqMutex);
        return deadMessages;
    }
    
    void clearDeadMessages() {
        lock_guard<mutex> lock(dlqMutex);
        deadMessages.clear();
        cout << "Cleared dead letter queue" << endl;
    }
    
    size_t size() const {
        lock_guard<mutex> lock(dlqMutex);
        return deadMessages.size();
    }
    
    void displayDeadMessages() const {
        lock_guard<mutex> lock(dlqMutex);
        
        cout << "\n=== Dead Letter Queue ===" << endl;
        cout << "Dead Messages: " << deadMessages.size() << endl;
        
        for (const auto& message : deadMessages) {
            cout << "Message ID: " << message.messageId;
            cout << ", Retries: " << message.retryCount;
            
            auto reasonIt = message.attributes.find("failure_reason");
            if (reasonIt != message.attributes.end()) {
                cout << ", Reason: " << reasonIt->second;
            }
            cout << endl;
        }
    }
};

// Message Consumer
template<typename T>
class MessageConsumer {
private:
    string consumerId;
    MessageQueue<T>& queue;
    DeadLetterQueue<T>& dlq;
    function<bool(const Message<T>&)> messageHandler;
    
    thread consumerThread;
    atomic<bool> running{false};
    
    // Statistics
    atomic<int> processedCount{0};
    atomic<int> errorCount{0};
    
public:
    MessageConsumer(const string& id, MessageQueue<T>& q, DeadLetterQueue<T>& deadQueue,
                   function<bool(const Message<T>&)> handler)
        : consumerId(id), queue(q), dlq(deadQueue), messageHandler(handler) {}
    
    ~MessageConsumer() {
        stop();
    }
    
    void start() {
        running = true;
        consumerThread = thread(&MessageConsumer::consumerLoop, this);
        cout << "Started consumer: " << consumerId << endl;
    }
    
    void stop() {
        running = false;
        if (consumerThread.joinable()) {
            consumerThread.join();
        }
        cout << "Stopped consumer: " << consumerId << endl;
    }
    
    void displayStats() const {
        cout << "\n=== Consumer " << consumerId << " Statistics ===" << endl;
        cout << "Processed Messages: " << processedCount.load() << endl;
        cout << "Error Count: " << errorCount.load() << endl;
        
        int total = processedCount.load() + errorCount.load();
        if (total > 0) {
            cout << "Success Rate: " << (double)processedCount.load() / total * 100 << "%" << endl;
        }
    }
    
private:
    void consumerLoop() {
        while (running) {
            Message<T> message;
            
            if (queue.dequeue(message, chrono::milliseconds(100))) {
                try {
                    if (messageHandler(message)) {
                        queue.acknowledgeMessage(message.messageId);
                        processedCount++;
                    } else {
                        handleMessageFailure(message, "Handler returned false");
                    }
                } catch (const exception& e) {
                    handleMessageFailure(message, string("Exception: ") + e.what());
                }
            }
        }
    }
    
    void handleMessageFailure(const Message<T>& message, const string& reason) {
        errorCount++;
        
        if (message.retryCount >= 3) { // Max retries exceeded
            dlq.addDeadMessage(message, reason);
        } else {
            queue.rejectMessage(message);
        }
    }
};
```

---

## ⚡ Key Takeaways

1. **Message queues** enable asynchronous communication and decouple system components
2. **Event-driven architecture** promotes loose coupling and scalability through event publishing and subscription
3. **Stream processing** handles continuous data flows with real-time transformations and analytics
4. **Event sourcing** provides complete audit trails and enables temporal queries and replay capabilities
5. **CQRS** separates read and write models for optimized performance and scalability
6. **Reliability patterns** like circuit breakers, retries, and acknowledgments ensure robust message delivery
7. **Dead letter queues** handle failed messages and provide debugging capabilities

## 🎯 Next Steps

- Study specific message queue technologies (Apache Kafka, RabbitMQ, Amazon SQS)
- Learn about event streaming platforms and their use cases
- Explore advanced stream processing frameworks (Apache Flink, Apache Storm)
- Practice implementing event-driven microservices architectures
- Understand message serialization formats (Avro, Protocol Buffers, JSON)
- Study distributed event sourcing and CQRS patterns at scale

---
*"In event-driven systems, the message is the medium, and the medium is the architecture."* - Anonymous 📬

---

## 🚌 EVENT BUS AND PUB/SUB PATTERNS

### What is Pub/Sub?
**Real-World Analogy**: Like a newspaper subscription service - publishers (newspapers) send content to a distribution center (event bus), which then delivers to all subscribers (readers) who are interested in specific topics.

```cpp
// Event Bus and Pub/Sub Implementation
#include <unordered_set>
#include <typeindex>

// Event base class
class Event {
public:
    string eventId;
    string eventType;
    chrono::system_clock::time_point timestamp;
    map<string, string> metadata;
    
    Event(const string& type) 
        : eventType(type), timestamp(chrono::system_clock::now()) {
        eventId = generateEventId();
    }
    
    virtual ~Event() = default;
    
private:
    string generateEventId() {
        static atomic<int> counter{0};
        return eventType + "_" + to_string(++counter);
    }
};

// Specific event types
class UserRegisteredEvent : public Event {
public:
    string userId;
    string email;
    string username;
    
    UserRegisteredEvent(const string& id, const string& mail, const string& user)
        : Event("UserRegistered"), userId(id), email(mail), username(user) {}
};

class OrderCreatedEvent : public Event {
public:
    string orderId;
    string customerId;
    double amount;
    vector<string> items;
    
    OrderCreatedEvent(const string& id, const string& customer, double amt, const vector<string>& orderItems)
        : Event("OrderCreated"), orderId(id), customerId(customer), amount(amt), items(orderItems) {}
};

class PaymentProcessedEvent : public Event {
public:
    string paymentId;
    string orderId;
    double amount;
    string status;
    
    PaymentProcessedEvent(const string& id, const string& order, double amt, const string& stat)
        : Event("PaymentProcessed"), paymentId(id), orderId(order), amount(amt), status(stat) {}
};

// Event Handler interface
template<typename EventType>
class EventHandler {
public:
    virtual ~EventHandler() = default;
    virtual void handle(const EventType& event) = 0;
    virtual string getHandlerId() const = 0;
};

// Event Bus
class EventBus {
private:
    // Type-erased handler storage
    map<type_index, vector<function<void(const Event&)>>> handlers;
    mutable mutex busMutex;
    
    // Event storage for replay
    vector<unique_ptr<Event>> eventHistory;
    size_t maxHistorySize;
    
    // Statistics
    atomic<int> totalEvents{0};
    atomic<int> totalHandlerInvocations{0};
    map<string, atomic<int>> eventTypeCount;
    
public:
    EventBus(size_t historySize = 10000) : maxHistorySize(historySize) {}
    
    template<typename EventType>
    void subscribe(shared_ptr<EventHandler<EventType>> handler) {
        lock_guard<mutex> lock(busMutex);
        
        auto wrapper = [handler](const Event& event) {
            const EventType* typedEvent = dynamic_cast<const EventType*>(&event);
            if (typedEvent) {
                handler->handle(*typedEvent);
            }
        };
        
        handlers[type_index(typeid(EventType))].push_back(wrapper);
        
        cout << "Subscribed handler " << handler->getHandlerId() 
             << " to event type: " << typeid(EventType).name() << endl;
    }
    
    template<typename EventType>
    void publish(const EventType& event) {
        {
            lock_guard<mutex> lock(busMutex);
            
            // Store event in history
            eventHistory.push_back(make_unique<EventType>(event));
            if (eventHistory.size() > maxHistorySize) {
                eventHistory.erase(eventHistory.begin());
            }
            
            totalEvents++;
            eventTypeCount[event.eventType]++;
        }
        
        cout << "Publishing event: " << event.eventId << " (" << event.eventType << ")" << endl;
        
        // Notify handlers
        auto typeIndex = type_index(typeid(EventType));
        
        {
            lock_guard<mutex> lock(busMutex);
            auto it = handlers.find(typeIndex);
            if (it != handlers.end()) {
                for (const auto& handler : it->second) {
                    try {
                        handler(event);
                        totalHandlerInvocations++;
                    } catch (const exception& e) {
                        cout << "Handler error for event " << event.eventId << ": " << e.what() << endl;
                    }
                }
            }
        }
    }
    
    void replayEvents(const string& eventType = "") {
        lock_guard<mutex> lock(busMutex);
        
        cout << "Replaying events" << (eventType.empty() ? "" : " of type: " + eventType) << endl;
        
        for (const auto& event : eventHistory) {
            if (eventType.empty() || event->eventType == eventType) {
                // Re-publish event (simplified - in reality, would need proper type handling)
                cout << "Replaying event: " << event->eventId << endl;
            }
        }
    }
    
    void displayStats() const {
        lock_guard<mutex> lock(busMutex);
        
        cout << "\n=== Event Bus Statistics ===" << endl;
        cout << "Total Events Published: " << totalEvents.load() << endl;
        cout << "Total Handler Invocations: " << totalHandlerInvocations.load() << endl;
        cout << "Event History Size: " << eventHistory.size() << endl;
        
        cout << "\nEvent Types:" << endl;
        for (const auto& count : eventTypeCount) {
            cout << "  " << count.first << ": " << count.second.load() << endl;
        }
        
        cout << "\nSubscribed Handlers:" << endl;
        for (const auto& handlerGroup : handlers) {
            cout << "  " << handlerGroup.first.name() << ": " << handlerGroup.second.size() << " handlers" << endl;
        }
    }
};

// Topic-based Pub/Sub System
class TopicBasedPubSub {
private:
    struct Subscription {
        string subscriberId;
        function<void(const Event&)> handler;
        chrono::system_clock::time_point subscribedAt;
        
        Subscription(const string& id, function<void(const Event&)> h)
            : subscriberId(id), handler(h), subscribedAt(chrono::system_clock::now()) {}
    };
    
    map<string, vector<Subscription>> topicSubscriptions;
    mutable mutex pubsubMutex;
    
    // Message persistence
    map<string, vector<unique_ptr<Event>>> topicMessages;
    size_t maxMessagesPerTopic;
    
    atomic<int> totalPublications{0};
    atomic<int> totalDeliveries{0};
    
public:
    TopicBasedPubSub(size_t maxMessages = 1000) : maxMessagesPerTopic(maxMessages) {}
    
    void subscribe(const string& topic, const string& subscriberId, 
                  function<void(const Event&)> handler) {
        lock_guard<mutex> lock(pubsubMutex);
        
        topicSubscriptions[topic].emplace_back(subscriberId, handler);
        
        cout << "Subscriber " << subscriberId << " subscribed to topic: " << topic << endl;
    }
    
    void unsubscribe(const string& topic, const string& subscriberId) {
        lock_guard<mutex> lock(pubsubMutex);
        
        auto& subscriptions = topicSubscriptions[topic];
        subscriptions.erase(
            remove_if(subscriptions.begin(), subscriptions.end(),
                [&subscriberId](const Subscription& sub) {
                    return sub.subscriberId == subscriberId;
                }),
            subscriptions.end()
        );
        
        cout << "Subscriber " << subscriberId << " unsubscribed from topic: " << topic << endl;
    }
    
    template<typename EventType>
    void publish(const string& topic, const EventType& event) {
        {
            lock_guard<mutex> lock(pubsubMutex);
            
            // Store message
            topicMessages[topic].push_back(make_unique<EventType>(event));
            if (topicMessages[topic].size() > maxMessagesPerTopic) {
                topicMessages[topic].erase(topicMessages[topic].begin());
            }
            
            totalPublications++;
        }
        
        cout << "Publishing to topic " << topic << ": " << event.eventId << endl;
        
        // Deliver to subscribers
        {
            lock_guard<mutex> lock(pubsubMutex);
            auto it = topicSubscriptions.find(topic);
            if (it != topicSubscriptions.end()) {
                for (const auto& subscription : it->second) {
                    try {
                        subscription.handler(event);
                        totalDeliveries++;
                        cout << "Delivered to subscriber: " << subscription.subscriberId << endl;
                    } catch (const exception& e) {
                        cout << "Delivery error to " << subscription.subscriberId << ": " << e.what() << endl;
                    }
                }
            }
        }
    }
    
    vector<string> getTopics() const {
        lock_guard<mutex> lock(pubsubMutex);
        
        vector<string> topics;
        for (const auto& topicSub : topicSubscriptions) {
            topics.push_back(topicSub.first);
        }
        return topics;
    }
    
    void displayTopicStats() const {
        lock_guard<mutex> lock(pubsubMutex);
        
        cout << "\n=== Topic-based Pub/Sub Statistics ===" << endl;
        cout << "Total Publications: " << totalPublications.load() << endl;
        cout << "Total Deliveries: " << totalDeliveries.load() << endl;
        
        cout << "\nTopics and Subscribers:" << endl;
        for (const auto& topicSub : topicSubscriptions) {
            cout << "Topic: " << topicSub.first << " (" << topicSub.second.size() << " subscribers)" << endl;
            for (const auto& sub : topicSub.second) {
                cout << "  - " << sub.subscriberId << endl;
            }
        }
        
        cout << "\nTopic Message Counts:" << endl;
        for (const auto& topicMsg : topicMessages) {
            cout << "  " << topicMsg.first << ": " << topicMsg.second.size() << " messages" << endl;
        }
    }
};

// Example Event Handlers
class EmailNotificationHandler : public EventHandler<UserRegisteredEvent> {
private:
    string handlerId;
    
public:
    EmailNotificationHandler(const string& id) : handlerId(id) {}
    
    void handle(const UserRegisteredEvent& event) override {
        cout << "EmailHandler: Sending welcome email to " << event.email 
             << " for user " << event.username << endl;
        
        // Simulate email sending delay
        this_thread::sleep_for(chrono::milliseconds(100));
    }
    
    string getHandlerId() const override {
        return handlerId;
    }
};

class InventoryHandler : public EventHandler<OrderCreatedEvent> {
private:
    string handlerId;
    
public:
    InventoryHandler(const string& id) : handlerId(id) {}
    
    void handle(const OrderCreatedEvent& event) override {
        cout << "InventoryHandler: Reserving items for order " << event.orderId << endl;
        
        for (const auto& item : event.items) {
            cout << "  - Reserved: " << item << endl;
        }
        
        // Simulate inventory processing
        this_thread::sleep_for(chrono::milliseconds(50));
    }
    
    string getHandlerId() const override {
        return handlerId;
    }
};

class AuditHandler : public EventHandler<PaymentProcessedEvent> {
private:
    string handlerId;
    
public:
    AuditHandler(const string& id) : handlerId(id) {}
    
    void handle(const PaymentProcessedEvent& event) override {
        cout << "AuditHandler: Logging payment " << event.paymentId 
             << " for order " << event.orderId 
             << " (Status: " << event.status << ")" << endl;
        
        // Simulate audit logging
        this_thread::sleep_for(chrono::milliseconds(25));
    }
    
    string getHandlerId() const override {
        return handlerId;
    }
};
```

---

## ⚡ STREAM PROCESSING SYSTEMS

### What is Stream Processing?
**Real-World Analogy**: Like a factory assembly line - data flows continuously through different processing stations, each adding value or transforming the product in real-time.

```cpp
// Stream Processing Implementation
#include <functional>
#include <numeric>

// Stream Event
template<typename T>
struct StreamEvent {
    string streamId;
    T data;
    chrono::system_clock::time_point timestamp;
    map<string, string> headers;
    
    StreamEvent(const string& id, const T& payload) 
        : streamId(id), data(payload), timestamp(chrono::system_clock::now()) {}
};

// Stream Processor Interface
template<typename InputType, typename OutputType>
class StreamProcessor {
public:
    virtual ~StreamProcessor() = default;
    virtual vector<StreamEvent<OutputType>> process(const StreamEvent<InputType>& event) = 0;
    virtual string getProcessorId() const = 0;
};

// Stream Processing Pipeline
template<typename T>
class StreamPipeline {
private:
    struct ProcessorNode {
        function<vector<StreamEvent<T>>(const StreamEvent<T>&)> processor;
        string processorId;
        atomic<int> processedCount{0};
        atomic<int> errorCount{0};
        
        ProcessorNode(function<vector<StreamEvent<T>>(const StreamEvent<T>&)> proc, const string& id)
            : processor(proc), processorId(id) {}
    };
    
    vector<unique_ptr<ProcessorNode>> processors;
    queue<StreamEvent<T>> inputStream;
    queue<StreamEvent<T>> outputStream;
    
    thread processingThread;
    atomic<bool> running{false};
    mutable mutex pipelineMutex;
    condition_variable streamCondition;
    
    // Windowing support
    map<string, vector<StreamEvent<T>>> windows;
    chrono::milliseconds windowSize;
    
public:
    StreamPipeline(chrono::milliseconds winSize = chrono::milliseconds(1000)) 
        : windowSize(winSize) {}
    
    ~StreamPipeline() {
        stop();
    }
    
    void addProcessor(function<vector<StreamEvent<T>>(const StreamEvent<T>&)> processor, 
                     const string& processorId) {
        processors.push_back(make_unique<ProcessorNode>(processor, processorId));
        cout << "Added processor to pipeline: " << processorId << endl;
    }
    
    void start() {
        running = true;
        processingThread = thread(&StreamPipeline::processingLoop, this);
        cout << "Started stream processing pipeline" << endl;
    }
    
    void stop() {
        running = false;
        streamCondition.notify_all();
        if (processingThread.joinable()) {
            processingThread.join();
        }
        cout << "Stopped stream processing pipeline" << endl;
    }
    
    void ingest(const StreamEvent<T>& event) {
        {
            lock_guard<mutex> lock(pipelineMutex);
            inputStream.push(event);
        }
        streamCondition.notify_one();
        cout << "Ingested event: " << event.streamId << endl;
    }
    
    bool getProcessedEvent(StreamEvent<T>& event) {
        lock_guard<mutex> lock(pipelineMutex);
        
        if (outputStream.empty()) {
            return false;
        }
        
        event = outputStream.front();
        outputStream.pop();
        return true;
    }
    
    void displayPipelineStats() const {
        cout << "\n=== Stream Pipeline Statistics ===" << endl;
        cout << "Input Queue Size: " << inputStream.size() << endl;
        cout << "Output Queue Size: " << outputStream.size() << endl;
        
        cout << "\nProcessor Statistics:" << endl;
        for (const auto& processor : processors) {
            cout << "Processor " << processor->processorId << ": "
                 << "Processed: " << processor->processedCount.load()
                 << ", Errors: " << processor->errorCount.load() << endl;
        }
    }
    
    // Windowed processing
    vector<StreamEvent<T>> getWindow(const string& windowKey) {
        lock_guard<mutex> lock(pipelineMutex);
        
        auto it = windows.find(windowKey);
        if (it != windows.end()) {
            return it->second;
        }
        return {};
    }
    
private:
    void processingLoop() {
        while (running) {
            StreamEvent<T> event("", T{});
            
            {
                unique_lock<mutex> lock(pipelineMutex);
                if (!streamCondition.wait_for(lock, chrono::milliseconds(100), 
                    [this] { return !inputStream.empty() || !running; })) {
                    continue;
                }
                
                if (!running) break;
                
                event = inputStream.front();
                inputStream.pop();
            }
            
            // Process through pipeline
            vector<StreamEvent<T>> currentEvents = {event};
            
            for (auto& processor : processors) {
                vector<StreamEvent<T>> nextEvents;
                
                for (const auto& currentEvent : currentEvents) {
                    try {
                        auto results = processor->processor(currentEvent);
                        nextEvents.insert(nextEvents.end(), results.begin(), results.end());
                        processor->processedCount++;
                    } catch (const exception& e) {
                        processor->errorCount++;
                        cout << "Processor " << processor->processorId << " error: " << e.what() << endl;
                    }
                }
                
                currentEvents = nextEvents;
            }
            
            // Add final results to output stream
            {
                lock_guard<mutex> lock(pipelineMutex);
                for (const auto& finalEvent : currentEvents) {
                    outputStream.push(finalEvent);
                }
            }
        }
    }
};

// Windowed Stream Processor
template<typename T>
class WindowedStreamProcessor {
private:
    struct Window {
        vector<StreamEvent<T>> events;
        chrono::system_clock::time_point windowStart;
        chrono::system_clock::time_point windowEnd;
        
        Window(chrono::system_clock::time_point start, chrono::milliseconds duration)
            : windowStart(start), windowEnd(start + duration) {}
    };
    
    map<string, Window> activeWindows;
    chrono::milliseconds windowDuration;
    function<void(const string&, const vector<StreamEvent<T>>&)> windowProcessor;
    
    thread windowThread;
    atomic<bool> running{false};
    mutable mutex windowMutex;
    
public:
    WindowedStreamProcessor(chrono::milliseconds duration, 
                           function<void(const string&, const vector<StreamEvent<T>>&)> processor)
        : windowDuration(duration), windowProcessor(processor) {}
    
    ~WindowedStreamProcessor() {
        stop();
    }
    
    void start() {
        running = true;
        windowThread = thread(&WindowedStreamProcessor::windowLoop, this);
        cout << "Started windowed stream processor" << endl;
    }
    
    void stop() {
        running = false;
        if (windowThread.joinable()) {
            windowThread.join();
        }
        cout << "Stopped windowed stream processor" << endl;
    }
    
    void addEvent(const StreamEvent<T>& event) {
        lock_guard<mutex> lock(windowMutex);
        
        string windowKey = getWindowKey(event.timestamp);
        
        auto it = activeWindows.find(windowKey);
        if (it == activeWindows.end()) {
            auto windowStart = getWindowStart(event.timestamp);
            activeWindows[windowKey] = Window(windowStart, windowDuration);
        }
        
        activeWindows[windowKey].events.push_back(event);
        cout << "Added event to window: " << windowKey << endl;
    }
    
private:
    string getWindowKey(chrono::system_clock::time_point timestamp) {
        auto windowStart = getWindowStart(timestamp);
        auto epoch = windowStart.time_since_epoch();
        auto millis = chrono::duration_cast<chrono::milliseconds>(epoch);
        return "window_" + to_string(millis.count());
    }
    
    chrono::system_clock::time_point getWindowStart(chrono::system_clock::time_point timestamp) {
        auto epoch = timestamp.time_since_epoch();
        auto millis = chrono::duration_cast<chrono::milliseconds>(epoch);
        auto windowNumber = millis.count() / windowDuration.count();
        auto windowStartMillis = windowNumber * windowDuration.count();
        return chrono::system_clock::time_point(chrono::milliseconds(windowStartMillis));
    }
    
    void windowLoop() {
        while (running) {
            this_thread::sleep_for(chrono::milliseconds(100));
            
            auto now = chrono::system_clock::now();
            vector<string> expiredWindows;
            
            {
                lock_guard<mutex> lock(windowMutex);
                
                for (const auto& windowPair : activeWindows) {
                    if (windowPair.second.windowEnd <= now) {
                        expiredWindows.push_back(windowPair.first);
                    }
                }
            }
            
            // Process expired windows
            for (const string& windowKey : expiredWindows) {
                {
                    lock_guard<mutex> lock(windowMutex);
                    auto it = activeWindows.find(windowKey);
                    if (it != activeWindows.end()) {
                        windowProcessor(windowKey, it->second.events);
                        activeWindows.erase(it);
                    }
                }
            }
        }
    }
};
```

---

## 🔄 EVENT SOURCING AND CQRS

### What is Event Sourcing?
**Real-World Analogy**: Like a bank's transaction ledger - instead of just storing current account balances, you keep a complete record of every deposit, withdrawal, and transfer to reconstruct the current state.

```cpp
// Event Sourcing Implementation
#include <variant>

// Domain Events
class DomainEvent {
public:
    string eventId;
    string aggregateId;
    string eventType;
    int version;
    chrono::system_clock::time_point timestamp;
    string userId;
    
    DomainEvent(const string& type, const string& aggId, int ver, const string& user = "")
        : eventType(type), aggregateId(aggId), version(ver), userId(user),
          timestamp(chrono::system_clock::now()) {
        eventId = generateEventId();
    }
    
    virtual ~DomainEvent() = default;
    virtual string serialize() const = 0;
    
private:
    string generateEventId() {
        static atomic<int> counter{0};
        return eventType + "_" + to_string(++counter);
    }
};

// Account Domain Events
class AccountCreatedEvent : public DomainEvent {
public:
    string accountNumber;
    string ownerName;
    double initialBalance;
    
    AccountCreatedEvent(const string& aggId, int ver, const string& accNum, 
                       const string& owner, double balance, const string& user)
        : DomainEvent("AccountCreated", aggId, ver, user), 
          accountNumber(accNum), ownerName(owner), initialBalance(balance) {}
    
    string serialize() const override {
        return "AccountCreated|" + aggregateId + "|" + accountNumber + "|" + 
               ownerName + "|" + to_string(initialBalance);
    }
};

class MoneyDepositedEvent : public DomainEvent {
public:
    double amount;
    string description;
    
    MoneyDepositedEvent(const string& aggId, int ver, double amt, const string& desc, const string& user)
        : DomainEvent("MoneyDeposited", aggId, ver, user), amount(amt), description(desc) {}
    
    string serialize() const override {
        return "MoneyDeposited|" + aggregateId + "|" + to_string(amount) + "|" + description;
    }
};

class MoneyWithdrawnEvent : public DomainEvent {
public:
    double amount;
    string description;
    
    MoneyWithdrawnEvent(const string& aggId, int ver, double amt, const string& desc, const string& user)
        : DomainEvent("MoneyWithdrawn", aggId, ver, user), amount(amt), description(desc) {}
    
    string serialize() const override {
        return "MoneyWithdrawn|" + aggregateId + "|" + to_string(amount) + "|" + description;
    }
};

// Event Store
class EventStore {
private:
    map<string, vector<unique_ptr<DomainEvent>>> eventStreams; // aggregateId -> events
    mutable mutex storeMutex;
    
    // Snapshots for performance
    map<string, pair<int, string>> snapshots; // aggregateId -> (version, snapshot)
    
    atomic<int> totalEvents{0};
    
public:
    void appendEvent(unique_ptr<DomainEvent> event) {
        lock_guard<mutex> lock(storeMutex);
        
        string aggregateId = event->aggregateId;
        eventStreams[aggregateId].push_back(move(event));
        totalEvents++;
        
        cout << "Appended event to stream: " << aggregateId << endl;
    }
    
    vector<unique_ptr<DomainEvent>> getEvents(const string& aggregateId, int fromVersion = 0) {
        lock_guard<mutex> lock(storeMutex);
        
        vector<unique_ptr<DomainEvent>> events;
        
        auto it = eventStreams.find(aggregateId);
        if (it != eventStreams.end()) {
            for (const auto& event : it->second) {
                if (event->version >= fromVersion) {
                    // Create a copy (simplified - in reality, would deserialize)
                    events.push_back(nullptr); // Placeholder for demonstration
                }
            }
        }
        
        cout << "Retrieved " << events.size() << " events for aggregate: " << aggregateId << endl;
        return events;
    }
    
    void saveSnapshot(const string& aggregateId, int version, const string& snapshot) {
        lock_guard<mutex> lock(storeMutex);
        
        snapshots[aggregateId] = {version, snapshot};
        cout << "Saved snapshot for aggregate " << aggregateId << " at version " << version << endl;
    }
    
    pair<int, string> getSnapshot(const string& aggregateId) {
        lock_guard<mutex> lock(storeMutex);
        
        auto it = snapshots.find(aggregateId);
        if (it != snapshots.end()) {
            return it->second;
        }
        return {0, ""};
    }
    
    void displayStats() const {
        lock_guard<mutex> lock(storeMutex);
        
        cout << "\n=== Event Store Statistics ===" << endl;
        cout << "Total Events: " << totalEvents.load() << endl;
        cout << "Event Streams: " << eventStreams.size() << endl;
        cout << "Snapshots: " << snapshots.size() << endl;
        
        for (const auto& stream : eventStreams) {
            cout << "Stream " << stream.first << ": " << stream.second.size() << " events" << endl;
        }
    }
};

// Aggregate Root
class BankAccount {
private:
    string accountId;
    string accountNumber;
    string ownerName;
    double balance;
    int version;
    bool isActive;
    
    vector<unique_ptr<DomainEvent>> uncommittedEvents;
    
public:
    BankAccount() : balance(0), version(0), isActive(false) {}
    
    BankAccount(const string& id, const string& accNum, const string& owner, double initialBalance)
        : accountId(id), accountNumber(accNum), ownerName(owner), 
          balance(initialBalance), version(0), isActive(true) {
        
        auto event = make_unique<AccountCreatedEvent>(accountId, ++version, accNum, owner, initialBalance, "system");
        uncommittedEvents.push_back(move(event));
    }
    
    // Command handlers
    void deposit(double amount, const string& description, const string& userId) {
        if (!isActive) {
            throw runtime_error("Account is not active");
        }
        
        if (amount <= 0) {
            throw runtime_error("Deposit amount must be positive");
        }
        
        auto event = make_unique<MoneyDepositedEvent>(accountId, ++version, amount, description, userId);
        applyEvent(*event);
        uncommittedEvents.push_back(move(event));
    }
    
    void withdraw(double amount, const string& description, const string& userId) {
        if (!isActive) {
            throw runtime_error("Account is not active");
        }
        
        if (amount <= 0) {
            throw runtime_error("Withdrawal amount must be positive");
        }
        
        if (balance < amount) {
            throw runtime_error("Insufficient funds");
        }
        
        auto event = make_unique<MoneyWithdrawnEvent>(accountId, ++version, amount, description, userId);
        applyEvent(*event);
        uncommittedEvents.push_back(move(event));
    }
    
    // Event application
    void applyEvent(const DomainEvent& event) {
        if (event.eventType == "AccountCreated") {
            const auto& e = static_cast<const AccountCreatedEvent&>(event);
            accountId = e.aggregateId;
            accountNumber = e.accountNumber;
            ownerName = e.ownerName;
            balance = e.initialBalance;
            isActive = true;
        } else if (event.eventType == "MoneyDeposited") {
            const auto& e = static_cast<const MoneyDepositedEvent&>(event);
            balance += e.amount;
        } else if (event.eventType == "MoneyWithdrawn") {
            const auto& e = static_cast<const MoneyWithdrawnEvent&>(event);
            balance -= e.amount;
        }
        
        version = event.version;
    }
    
    // Getters
    string getAccountId() const { return accountId; }
    string getAccountNumber() const { return accountNumber; }
    string getOwnerName() const { return ownerName; }
    double getBalance() const { return balance; }
    int getVersion() const { return version; }
    bool getIsActive() const { return isActive; }
    
    vector<unique_ptr<DomainEvent>> getUncommittedEvents() {
        vector<unique_ptr<DomainEvent>> events;
        events.swap(uncommittedEvents);
        return events;
    }
    
    void markEventsAsCommitted() {
        uncommittedEvents.clear();
    }
    
    void displayAccount() const {
        cout << "\n=== Bank Account ===" << endl;
        cout << "Account ID: " << accountId << endl;
        cout << "Account Number: " << accountNumber << endl;
        cout << "Owner: " << ownerName << endl;
        cout << "Balance: $" << balance << endl;
        cout << "Version: " << version << endl;
        cout << "Active: " << (isActive ? "Yes" : "No") << endl;
    }
};

// CQRS - Command Query Responsibility Segregation
class AccountCommandHandler {
private:
    EventStore& eventStore;
    
public:
    AccountCommandHandler(EventStore& store) : eventStore(store) {}
    
    void createAccount(const string& accountId, const string& accountNumber, 
                      const string& ownerName, double initialBalance) {
        BankAccount account(accountId, accountNumber, ownerName, initialBalance);
        
        auto events = account.getUncommittedEvents();
        for (auto& event : events) {
            eventStore.appendEvent(move(event));
        }
        
        cout << "Command: Created account " << accountNumber << endl;
    }
    
    void depositMoney(const string& accountId, double amount, const string& description, const string& userId) {
        BankAccount account = loadAccount(accountId);
        account.deposit(amount, description, userId);
        
        auto events = account.getUncommittedEvents();
        for (auto& event : events) {
            eventStore.appendEvent(move(event));
        }
        
        cout << "Command: Deposited $" << amount << " to account " << accountId << endl;
    }
    
    void withdrawMoney(const string& accountId, double amount, const string& description, const string& userId) {
        BankAccount account = loadAccount(accountId);
        account.withdraw(amount, description, userId);
        
        auto events = account.getUncommittedEvents();
        for (auto& event : events) {
            eventStore.appendEvent(move(event));
        }
        
        cout << "Command: Withdrew $" << amount << " from account " << accountId << endl;
    }
    
private:
    BankAccount loadAccount(const string& accountId) {
        // Load from snapshot if available
        auto snapshot = eventStore.getSnapshot(accountId);
        
        BankAccount account;
        int fromVersion = 0;
        
        if (!snapshot.second.empty()) {
            // Deserialize from snapshot (simplified)
            fromVersion = snapshot.first + 1;
        }
        
        // Apply events from snapshot version
        auto events = eventStore.getEvents(accountId, fromVersion);
        for (const auto& event : events) {
            if (event) {
                account.applyEvent(*event);
            }
        }
        
        return account;
    }
};

// Read Model for queries
struct AccountReadModel {
    string accountId;
    string accountNumber;
    string ownerName;
    double balance;
    chrono::system_clock::time_point lastUpdated;
    vector<string> recentTransactions;
};

class AccountQueryHandler {
private:
    map<string, AccountReadModel> readModels;
    mutable mutex queryMutex;
    
public:
    void updateReadModel(const DomainEvent& event) {
        lock_guard<mutex> lock(queryMutex);
        
        auto& model = readModels[event.aggregateId];
        model.accountId = event.aggregateId;
        model.lastUpdated = event.timestamp;
        
        if (event.eventType == "AccountCreated") {
            const auto& e = static_cast<const AccountCreatedEvent&>(event);
            model.accountNumber = e.accountNumber;
            model.ownerName = e.ownerName;
            model.balance = e.initialBalance;
            model.recentTransactions.push_back("Account created with $" + to_string(e.initialBalance));
        } else if (event.eventType == "MoneyDeposited") {
            const auto& e = static_cast<const MoneyDepositedEvent&>(event);
            model.balance += e.amount;
            model.recentTransactions.push_back("Deposited $" + to_string(e.amount) + " - " + e.description);
        } else if (event.eventType == "MoneyWithdrawn") {
            const auto& e = static_cast<const MoneyWithdrawnEvent&>(event);
            model.balance -= e.amount;
            model.recentTransactions.push_back("Withdrew $" + to_string(e.amount) + " - " + e.description);
        }
        
        // Keep only recent transactions
        if (model.recentTransactions.size() > 10) {
            model.recentTransactions.erase(model.recentTransactions.begin());
        }
        
        cout << "Query: Updated read model for account " << event.aggregateId << endl;
    }
    
    AccountReadModel getAccount(const string& accountId) {
        lock_guard<mutex> lock(queryMutex);
        
        auto it = readModels.find(accountId);
        if (it != readModels.end()) {
            return it->second;
        }
        
        throw runtime_error("Account not found: " + accountId);
    }
    
    vector<AccountReadModel> getAllAccounts() {
        lock_guard<mutex> lock(queryMutex);
        
        vector<AccountReadModel> accounts;
        for (const auto& modelPair : readModels) {
            accounts.push_back(modelPair.second);
        }
        return accounts;
    }
    
    double getTotalBalance() {
        lock_guard<mutex> lock(queryMutex);
        
        double total = 0;
        for (const auto& modelPair : readModels) {
            total += modelPair.second.balance;
        }
        return total;
    }
};
```

---

## 🛡️ RELIABILITY AND ERROR HANDLING

### What is Message Reliability?
**Real-World Analogy**: Like a postal service with tracking, insurance, and guaranteed delivery - messages need acknowledgments, retries, and fallback mechanisms to ensure they reach their destination.

```cpp
// Reliability and Error Handling Implementation

// Circuit Breaker Pattern
class CircuitBreaker {
private:
    enum class State {
        CLOSED,    // Normal operation
        OPEN,      // Failing, reject requests
        HALF_OPEN  // Testing if service recovered
    };
    
    State state;
    int failureCount;
    int successCount;
    chrono::system_clock::time_point lastFailureTime;
    
    // Configuration
    int failureThreshold;
    int successThreshold;
    chrono::milliseconds timeout;
    
    mutable mutex breakerMutex;
    
public:
    CircuitBreaker(int failThreshold = 5, int successThreshold = 3, 
                  chrono::milliseconds timeoutDuration = chrono::milliseconds(60000))
        : state(State::CLOSED), failureCount(0), successCount(0),
          failureThreshold(failThreshold), successThreshold(successThreshold), timeout(timeoutDuration) {}
    
    template<typename Func>
    auto execute(Func&& func) -> decltype(func()) {
        lock_guard<mutex> lock(breakerMutex);
        
        if (state == State::OPEN) {
            if (chrono::system_clock::now() - lastFailureTime > timeout) {
                state = State::HALF_OPEN;
                successCount = 0;
                cout << "Circuit Breaker: Transitioning to HALF_OPEN" << endl;
            } else {
                throw runtime_error("Circuit breaker is OPEN");
            }
        }
        
        try {
            auto result = func();
            onSuccess();
            return result;
        } catch (const exception& e) {
            onFailure();
            throw;
        }
    }
    
    State getState() const {
        lock_guard<mutex> lock(breakerMutex);
        return state;
    }
    
    void displayStats() const {
        lock_guard<mutex> lock(breakerMutex);
        
        string stateStr;
        switch (state) {
            case State::CLOSED: stateStr = "CLOSED"; break;
            case State::OPEN: stateStr = "OPEN"; break;
            case State::HALF_OPEN: stateStr = "HALF_OPEN"; break;
        }
        
        cout << "\n=== Circuit Breaker Statistics ===" << endl;
        cout << "State: " << stateStr << endl;
        cout << "Failure Count: " << failureCount << endl;
        cout << "Success Count: " << successCount << endl;
    }
    
private:
    void onSuccess() {
        if (state == State::HALF_OPEN) {
            successCount++;
            if (successCount >= successThreshold) {
                state = State::CLOSED;
                failureCount = 0;
                cout << "Circuit Breaker: Transitioning to CLOSED" << endl;
            }
        } else {
            failureCount = 0;
        }
    }
    
    void onFailure() {
        failureCount++;
        lastFailureTime = chrono::system_clock::now();
        
        if (state == State::HALF_OPEN || failureCount >= failureThreshold) {
            state = State::OPEN;
            cout << "Circuit Breaker: Transitioning to OPEN" << endl;
        }
    }
};

// Retry Mechanism with Exponential Backoff
class RetryPolicy {
private:
    int maxRetries;
    chrono::milliseconds baseDelay;
    double backoffMultiplier;
    chrono::milliseconds maxDelay;
    
public:
    RetryPolicy(int retries = 3, chrono::milliseconds delay = chrono::milliseconds(1000),
               double multiplier = 2.0, chrono::milliseconds maxDelayTime = chrono::milliseconds(30000))
        : maxRetries(retries), baseDelay(delay), backoffMultiplier(multiplier), maxDelay(maxDelayTime) {}
    
    template<typename Func>
    auto executeWithRetry(Func&& func) -> decltype(func()) {
        int attempt = 0;
        chrono::milliseconds currentDelay = baseDelay;
        
        while (attempt <= maxRetries) {
            try {
                auto result = func();
                if (attempt > 0) {
                    cout << "Retry: Succeeded on attempt " << (attempt + 1) << endl;
                }
                return result;
            } catch (const exception& e) {
                attempt++;
                
                if (attempt > maxRetries) {
                    cout << "Retry: Failed after " << maxRetries << " attempts" << endl;
                    throw;
                }
                
                cout << "Retry: Attempt " << attempt << " failed, retrying in " 
                     << currentDelay.count() << "ms" << endl;
                
                this_thread::sleep_for(currentDelay);
                
                // Exponential backoff
                currentDelay = chrono::milliseconds(
                    min((long long)(currentDelay.count() * backoffMultiplier), maxDelay.count())
                );
            }
        }
        
        throw runtime_error("Retry policy exhausted");
    }
};

// Message Acknowledgment System
template<typename T>
class ReliableMessageQueue {
private:
    struct ReliableMessage {
        Message<T> message;
        chrono::system_clock::time_point sentAt;
        bool acknowledged;
        int deliveryAttempts;
        
        ReliableMessage(const Message<T>& msg) 
            : message(msg), sentAt(chrono::system_clock::now()), 
              acknowledged(false), deliveryAttempts(0) {}
    };
    
    queue<Message<T>> pendingMessages;
    map<string, ReliableMessage> inFlightMessages;
    DeadLetterQueue<T>& dlq;
    
    mutable mutex reliableMutex;
    condition_variable messageCondition;
    
    // Configuration
    chrono::seconds ackTimeout;
    int maxDeliveryAttempts;
    
    // Background processing
    thread ackTimeoutThread;
    atomic<bool> running{false};
    
    // Statistics
    atomic<int> totalSent{0};
    atomic<int> totalAcknowledged{0};
    atomic<int> totalTimedOut{0};
    
public:
    ReliableMessageQueue(DeadLetterQueue<T>& deadQueue, 
                        chrono::seconds timeout = chrono::seconds(30), int maxAttempts = 3)
        : dlq(deadQueue), ackTimeout(timeout), maxDeliveryAttempts(maxAttempts) {}
    
    ~ReliableMessageQueue() {
        stop();
    }
    
    void start() {
        running = true;
        ackTimeoutThread = thread(&ReliableMessageQueue::timeoutLoop, this);
        cout << "Started reliable message queue" << endl;
    }
    
    void stop() {
        running = false;
        messageCondition.notify_all();
        if (ackTimeoutThread.joinable()) {
            ackTimeoutThread.join();
        }
        cout << "Stopped reliable message queue" << endl;
    }
    
    void enqueue(const Message<T>& message) {
        {
            lock_guard<mutex> lock(reliableMutex);
            pendingMessages.push(message);
        }
        messageCondition.notify_one();
        cout << "Enqueued reliable message: " << message.messageId << endl;
    }
    
    bool dequeue(Message<T>& message, chrono::milliseconds timeout = chrono::milliseconds(1000)) {
        unique_lock<mutex> lock(reliableMutex);
        
        if (!messageCondition.wait_for(lock, timeout, [this] { return !pendingMessages.empty(); })) {
            return false;
        }
        
        message = pendingMessages.front();
        pendingMessages.pop();
        
        // Track as in-flight
        inFlightMessages[message.messageId] = ReliableMessage(message);
        inFlightMessages[message.messageId].deliveryAttempts++;
        totalSent++;
        
        cout << "Dequeued reliable message: " << message.messageId << " (Attempt: " 
             << inFlightMessages[message.messageId].deliveryAttempts << ")" << endl;
        
        return true;
    }
    
    void acknowledge(const string& messageId) {
        lock_guard<mutex> lock(reliableMutex);
        
        auto it = inFlightMessages.find(messageId);
        if (it != inFlightMessages.end()) {
            it->second.acknowledged = true;
            inFlightMessages.erase(it);
            totalAcknowledged++;
            cout << "Acknowledged message: " << messageId << endl;
        }
    }
    
    void negativeAcknowledge(const string& messageId, const string& reason) {
        lock_guard<mutex> lock(reliableMutex);
        
        auto it = inFlightMessages.find(messageId);
        if (it != inFlightMessages.end()) {
            if (it->second.deliveryAttempts < maxDeliveryAttempts) {
                // Requeue for retry
                pendingMessages.push(it->second.message);
                cout << "Requeued message for retry: " << messageId << endl;
            } else {
                // Send to dead letter queue
                dlq.addDeadMessage(it->second.message, reason);
                cout << "Sent message to DLQ: " << messageId << endl;
            }
            
            inFlightMessages.erase(it);
        }
        
        messageCondition.notify_one();
    }
    
    void displayReliabilityStats() const {
        lock_guard<mutex> lock(reliableMutex);
        
        cout << "\n=== Reliable Message Queue Statistics ===" << endl;
        cout << "Pending Messages: " << pendingMessages.size() << endl;
        cout << "In-Flight Messages: " << inFlightMessages.size() << endl;
        cout << "Total Sent: " << totalSent.load() << endl;
        cout << "Total Acknowledged: " << totalAcknowledged.load() << endl;
        cout << "Total Timed Out: " << totalTimedOut.load() << endl;
        
        if (totalSent.load() > 0) {
            double ackRate = (double)totalAcknowledged.load() / totalSent.load() * 100;
            cout << "Acknowledgment Rate: " << ackRate << "%" << endl;
        }
    }
    
private:
    void timeoutLoop() {
        while (running) {
            this_thread::sleep_for(chrono::seconds(1));
            
            auto now = chrono::system_clock::now();
            vector<string> timedOutMessages;
            
            {
                lock_guard<mutex> lock(reliableMutex);
                
                for (const auto& inFlightPair : inFlightMessages) {
                    const auto& reliableMsg = inFlightPair.second;
                    if (now - reliableMsg.sentAt > ackTimeout) {
                        timedOutMessages.push_back(inFlightPair.first);
                    }
                }
            }
            
            // Handle timeouts
            for (const string& messageId : timedOutMessages) {
                totalTimedOut++;
                negativeAcknowledge(messageId, "Acknowledgment timeout");
            }
        }
    }
};
```
