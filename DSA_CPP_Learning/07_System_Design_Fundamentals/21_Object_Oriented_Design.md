# Object Oriented Design - Building Software Like LEGO Blocks

## 🌟 Real-World Story: The LEGO Factory

Imagine you're running a LEGO factory. Instead of creating one massive, unchangeable toy, you design **modular blocks** that can be combined in countless ways. Each block has:
- **Clear interfaces** (how it connects to other blocks)
- **Hidden internals** (the plastic composition is internal)
- **Specific responsibilities** (some blocks are wheels, some are walls)
- **Reusability** (the same wheel block works on cars, trucks, and planes)

This is exactly how Object-Oriented Design works in software!

## 🎯 Why Object-Oriented Design Matters

### Real Applications:
- **Video Games**: Characters, weapons, and environments as objects
- **Banking Software**: Accounts, transactions, and customers as objects
- **Social Media**: Users, posts, and comments as objects
- **E-commerce**: Products, orders, and shopping carts as objects

## 📊 The Four Pillars of OOP

### 1. 🏠 Encapsulation - "Private Property"
**Real-World Analogy**: Your house has private rooms (bedroom) and public areas (living room)

```cpp
class BankAccount {
private:
    double balance;        // Private - only this class can access
    string accountNumber;  // Private - hidden from outside
    
public:
    // Public interface - how others interact with this account
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
    
    double getBalance() const {
        return balance;  // Controlled access to private data
    }
};
```

**Why Encapsulation?**
- **Security**: Can't directly mess with balance
- **Validation**: Deposit/withdraw methods can check validity
- **Flexibility**: Can change internal implementation without affecting users

### 2. 🧬 Inheritance - "Family Traits"
**Real-World Analogy**: Children inherit traits from parents (eye color, height) but also have unique features

```cpp
// Base class - common features of all vehicles
class Vehicle {
protected:
    string brand;
    int year;
    double speed;
    
public:
    Vehicle(string b, int y) : brand(b), year(y), speed(0) {}
    
    virtual void start() {
        cout << brand << " is starting..." << endl;
    }
    
    virtual void accelerate() {
        speed += 10;
        cout << "Speed: " << speed << " km/h" << endl;
    }
    
    virtual ~Vehicle() = default;  // Virtual destructor
};

// Derived class - inherits from Vehicle + adds car-specific features
class Car : public Vehicle {
private:
    int doors;
    bool hasAirConditioning;
    
public:
    Car(string b, int y, int d) : Vehicle(b, y), doors(d), hasAirConditioning(true) {}
    
    void start() override {
        cout << "Car engine starting with key..." << endl;
        Vehicle::start();  // Call parent method
    }
    
    void openTrunk() {
        cout << "Trunk opened!" << endl;
    }
};

// Another derived class
class Motorcycle : public Vehicle {
private:
    bool hasSidecar;
    
public:
    Motorcycle(string b, int y) : Vehicle(b, y), hasSidecar(false) {}
    
    void start() override {
        cout << "Motorcycle starting with kick/button..." << endl;
        Vehicle::start();
    }
    
    void wheelie() {
        cout << "Doing a wheelie!" << endl;
    }
};
```

### 3. 🎭 Polymorphism - "Many Forms"
**Real-World Analogy**: A "speaker" can be a person giving a speech, a stereo speaker, or a phone speaker - same name, different behavior

```cpp
// Using polymorphism - same interface, different behaviors
void testVehicle(Vehicle* vehicle) {
    vehicle->start();      // Calls appropriate start() method
    vehicle->accelerate(); // Calls appropriate accelerate() method
}

int main() {
    Car myCar("Toyota", 2023, 4);
    Motorcycle myBike("Harley", 2022);
    
    // Polymorphism in action!
    testVehicle(&myCar);   // Calls Car's start()
    testVehicle(&myBike);  // Calls Motorcycle's start()
    
    // Array of different vehicle types
    vector<unique_ptr<Vehicle>> garage;
    garage.push_back(make_unique<Car>("BMW", 2023, 2));
    garage.push_back(make_unique<Motorcycle>("Yamaha", 2022));
    
    // Same code works for all vehicle types!
    for (auto& vehicle : garage) {
        vehicle->start();
        vehicle->accelerate();
    }
    
    return 0;
}
```

### 4. 🎨 Abstraction - "Hiding Complexity"
**Real-World Analogy**: You drive a car using steering wheel, pedals, and gear shift. You don't need to know about engine internals, fuel injection, or transmission mechanics.

```cpp
// Abstract base class - defines interface but not implementation
class Shape {
public:
    // Pure virtual functions - must be implemented by derived classes
    virtual double calculateArea() = 0;
    virtual double calculatePerimeter() = 0;
    virtual void draw() = 0;
    
    // Virtual destructor for proper cleanup
    virtual ~Shape() = default;
    
    // Common functionality for all shapes
    void printInfo() {
        cout << "Area: " << calculateArea() << endl;
        cout << "Perimeter: " << calculatePerimeter() << endl;
    }
};

class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    double calculateArea() override {
        return 3.14159 * radius * radius;
    }
    
    double calculatePerimeter() override {
        return 2 * 3.14159 * radius;
    }
    
    void draw() override {
        cout << "Drawing a circle with radius " << radius << endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;
    
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double calculateArea() override {
        return width * height;
    }
    
    double calculatePerimeter() override {
        return 2 * (width + height);
    }
    
    void draw() override {
        cout << "Drawing a rectangle " << width << "x" << height << endl;
    }
};
```

## 🏗️ SOLID Principles - The Foundation of Good Design

### S - Single Responsibility Principle (SRP)
**"A class should have only one reason to change"**

❌ **Bad Example**:
```cpp
class User {
    string name, email;
    
public:
    // User data management
    void setName(string n) { name = n; }
    void setEmail(string e) { email = e; }
    
    // Database operations - WRONG! Different responsibility
    void saveToDatabase() { /* database code */ }
    void loadFromDatabase() { /* database code */ }
    
    // Email operations - WRONG! Another different responsibility
    void sendEmail() { /* email sending code */ }
    void validateEmail() { /* email validation */ }
};
```

✅ **Good Example**:
```cpp
// Each class has ONE responsibility
class User {
private:
    string name, email;
    
public:
    void setName(string n) { name = n; }
    void setEmail(string e) { email = e; }
    string getName() const { return name; }
    string getEmail() const { return email; }
};

class UserRepository {
public:
    void save(const User& user) { /* database save */ }
    User load(int userId) { /* database load */ }
};

class EmailService {
public:
    void sendEmail(const User& user, string message) { /* send email */ }
    bool validateEmail(string email) { /* validate email */ }
};
```

### O - Open/Closed Principle (OCP)
**"Open for extension, closed for modification"**

```cpp
// Base class - closed for modification
class PaymentProcessor {
public:
    virtual double processPayment(double amount) = 0;
    virtual ~PaymentProcessor() = default;
};

// Extensions - open for extension
class CreditCardProcessor : public PaymentProcessor {
public:
    double processPayment(double amount) override {
        // Credit card specific logic
        double fee = amount * 0.03;  // 3% fee
        return amount + fee;
    }
};

class PayPalProcessor : public PaymentProcessor {
public:
    double processPayment(double amount) override {
        // PayPal specific logic
        double fee = amount * 0.025;  // 2.5% fee
        return amount + fee;
    }
};

class CryptoProcessor : public PaymentProcessor {
public:
    double processPayment(double amount) override {
        // Cryptocurrency specific logic
        double fee = amount * 0.01;  // 1% fee
        return amount + fee;
    }
};

// Usage - can add new payment methods without changing existing code
class ShoppingCart {
private:
    unique_ptr<PaymentProcessor> processor;
    
public:
    void setPaymentProcessor(unique_ptr<PaymentProcessor> p) {
        processor = move(p);
    }
    
    double checkout(double amount) {
        return processor->processPayment(amount);
    }
};
```

### L - Liskov Substitution Principle (LSP)
**"Objects of a superclass should be replaceable with objects of its subclasses"**

```cpp
class Bird {
public:
    virtual void eat() { cout << "Bird is eating" << endl; }
    virtual void makeSound() { cout << "Bird makes sound" << endl; }
    virtual ~Bird() = default;
};

// Good - follows LSP
class Sparrow : public Bird {
public:
    void eat() override { cout << "Sparrow pecks seeds" << endl; }
    void makeSound() override { cout << "Chirp chirp!" << endl; }
    void fly() { cout << "Sparrow flies" << endl; }
};

class Eagle : public Bird {
public:
    void eat() override { cout << "Eagle hunts prey" << endl; }
    void makeSound() override { cout << "Screech!" << endl; }
    void fly() { cout << "Eagle soars" << endl; }
};

// This works perfectly - LSP satisfied
void birdBehavior(Bird* bird) {
    bird->eat();        // Works for any bird
    bird->makeSound();  // Works for any bird
}
```

### I - Interface Segregation Principle (ISP)
**"Don't force classes to depend on interfaces they don't use"**

❌ **Bad Example**:
```cpp
class Worker {
public:
    virtual void work() = 0;
    virtual void eat() = 0;
    virtual void sleep() = 0;  // Not all workers need this!
};

class Robot : public Worker {
public:
    void work() override { cout << "Robot working" << endl; }
    void eat() override { /* Robots don't eat! */ }
    void sleep() override { /* Robots don't sleep! */ }
};
```

✅ **Good Example**:
```cpp
// Segregated interfaces
class Workable {
public:
    virtual void work() = 0;
    virtual ~Workable() = default;
};

class Eatable {
public:
    virtual void eat() = 0;
    virtual ~Eatable() = default;
};

class Sleepable {
public:
    virtual void sleep() = 0;
    virtual ~Sleepable() = default;
};

// Human implements all interfaces
class Human : public Workable, public Eatable, public Sleepable {
public:
    void work() override { cout << "Human working" << endl; }
    void eat() override { cout << "Human eating" << endl; }
    void sleep() override { cout << "Human sleeping" << endl; }
};

// Robot only implements what it needs
class Robot : public Workable {
public:
    void work() override { cout << "Robot working" << endl; }
};
```

### D - Dependency Inversion Principle (DIP)
**"Depend on abstractions, not concretions"**

❌ **Bad Example**:
```cpp
class MySQLDatabase {
public:
    void save(string data) { cout << "Saving to MySQL: " << data << endl; }
};

class UserService {
private:
    MySQLDatabase db;  // Tightly coupled to MySQL!
    
public:
    void createUser(string userData) {
        // Business logic
        db.save(userData);  // Can't easily switch databases
    }
};
```

✅ **Good Example**:
```cpp
// Abstract interface
class Database {
public:
    virtual void save(string data) = 0;
    virtual ~Database() = default;
};

// Concrete implementations
class MySQLDatabase : public Database {
public:
    void save(string data) override {
        cout << "Saving to MySQL: " << data << endl;
    }
};

class PostgreSQLDatabase : public Database {
public:
    void save(string data) override {
        cout << "Saving to PostgreSQL: " << data << endl;
    }
};

class MongoDatabase : public Database {
public:
    void save(string data) override {
        cout << "Saving to MongoDB: " << data << endl;
    }
};

// Service depends on abstraction
class UserService {
private:
    unique_ptr<Database> db;
    
public:
    UserService(unique_ptr<Database> database) : db(move(database)) {}
    
    void createUser(string userData) {
        // Business logic
        db->save(userData);  // Can use any database implementation!
    }
};

// Usage - easy to switch databases
int main() {
    // Can easily switch between different databases
    auto userService1 = make_unique<UserService>(make_unique<MySQLDatabase>());
    auto userService2 = make_unique<UserService>(make_unique<PostgreSQLDatabase>());
    auto userService3 = make_unique<UserService>(make_unique<MongoDatabase>());
    
    userService1->createUser("John Doe");
    userService2->createUser("Jane Smith");
    userService3->createUser("Bob Johnson");
    
    return 0;
}
```

## 🎮 Practice Problems

### Problem 1: Library Management System
Design a library system with:
- Books, DVDs, and Magazines (different types of items)
- Members who can borrow items
- Different borrowing rules for different item types

### Problem 2: Shape Calculator
Create a shape hierarchy that can:
- Calculate area and perimeter for different shapes
- Draw shapes in different formats (ASCII, SVG)
- Support adding new shapes without modifying existing code

### Problem 3: Payment System
Design a payment processing system that:
- Supports multiple payment methods
- Can easily add new payment providers
- Handles different fee structures
- Follows all SOLID principles

## 🚀 Real Applications

### 1. **Game Development**
```cpp
class GameObject {
public:
    virtual void update() = 0;
    virtual void render() = 0;
    virtual ~GameObject() = default;
};

class Player : public GameObject { /* ... */ };
class Enemy : public GameObject { /* ... */ };
class PowerUp : public GameObject { /* ... */ };
```

### 2. **GUI Applications**
```cpp
class Widget {
public:
    virtual void draw() = 0;
    virtual void handleClick() = 0;
    virtual ~Widget() = default;
};

class Button : public Widget { /* ... */ };
class TextBox : public Widget { /* ... */ };
class CheckBox : public Widget { /* ... */ };
```

### 3. **File Processing**
```cpp
class FileProcessor {
public:
    virtual void process(string filename) = 0;
    virtual ~FileProcessor() = default;
};

class ImageProcessor : public FileProcessor { /* ... */ };
class VideoProcessor : public FileProcessor { /* ... */ };
class DocumentProcessor : public FileProcessor { /* ... */ };
```

## ⚡ Key Takeaways

1. **Encapsulation**: Hide internal details, expose clean interfaces
2. **Inheritance**: Share common behavior, specialize where needed
3. **Polymorphism**: Same interface, different implementations
4. **Abstraction**: Focus on what, not how
5. **SOLID Principles**: Guidelines for maintainable, flexible code

## 🎯 Next Steps

- Practice implementing the four pillars in your own projects
- Study design patterns (next topic) to see OOP principles in action
- Refactor existing code to follow SOLID principles
- Design class hierarchies for real-world problems

---
*"Good object-oriented design is like a well-organized toolbox - everything has its place and purpose!"* 🧰
