# LLD Interview Problems - Real-World System Design Challenges

## 🌟 Real-World Story: The Architect's Portfolio

Imagine you're an architect applying for a job. The interviewer doesn't just ask about building materials or construction techniques. Instead, they say: "Design a shopping mall that can handle 10,000 visitors daily, has different types of stores, manages parking efficiently, and ensures smooth customer flow."

This is exactly what LLD (Low Level Design) interviews are like! They test your ability to translate real-world requirements into well-structured, object-oriented code that's maintainable, extensible, and follows good design principles.

## 🎯 Why LLD Interview Problems Matter

### Real Applications:
- **Software Engineering Roles**: Senior developer, architect positions
- **Product Companies**: Google, Amazon, Microsoft, Meta interviews
- **System Design Skills**: Breaking down complex problems
- **Code Quality**: Writing clean, maintainable, extensible code

## 📊 Common LLD Interview Patterns

### 🏗️ System Modeling
### 🎯 Design Patterns Application
### 🔄 State Management
### 📊 Data Structure Selection
### 🧩 Component Interaction

---

## 🅿️ PROBLEM 1: PARKING LOT SYSTEM

### Problem Statement
Design a parking lot system that can:
- Handle different vehicle types (car, motorcycle, truck)
- Have different parking spot sizes (compact, regular, large)
- Track availability and occupancy
- Calculate parking fees based on time
- Support multiple floors and sections

### Solution Approach

```cpp
#include <iostream>
#include <vector>
#include <map>
#include <memory>
#include <chrono>
#include <queue>

using namespace std;
using namespace chrono;

// Enums for different types
enum class VehicleType {
    MOTORCYCLE,
    CAR,
    TRUCK
};

enum class SpotType {
    COMPACT,
    REGULAR,
    LARGE
};

enum class SpotStatus {
    AVAILABLE,
    OCCUPIED,
    RESERVED
};

// Vehicle hierarchy
class Vehicle {
protected:
    string licensePlate;
    VehicleType type;
    
public:
    Vehicle(const string& plate, VehicleType t) : licensePlate(plate), type(t) {}
    virtual ~Vehicle() = default;
    
    string getLicensePlate() const { return licensePlate; }
    VehicleType getType() const { return type; }
    virtual bool canFitInSpot(SpotType spotType) const = 0;
};

class Motorcycle : public Vehicle {
public:
    Motorcycle(const string& plate) : Vehicle(plate, VehicleType::MOTORCYCLE) {}
    
    bool canFitInSpot(SpotType spotType) const override {
        return true; // Motorcycle can fit in any spot
    }
};

class Car : public Vehicle {
public:
    Car(const string& plate) : Vehicle(plate, VehicleType::CAR) {}
    
    bool canFitInSpot(SpotType spotType) const override {
        return spotType == SpotType::REGULAR || spotType == SpotType::LARGE;
    }
};

class Truck : public Vehicle {
public:
    Truck(const string& plate) : Vehicle(plate, VehicleType::TRUCK) {}
    
    bool canFitInSpot(SpotType spotType) const override {
        return spotType == SpotType::LARGE;
    }
};

// Parking spot
class ParkingSpot {
private:
    int spotId;
    SpotType type;
    SpotStatus status;
    shared_ptr<Vehicle> parkedVehicle;
    time_point<system_clock> parkingStartTime;
    
public:
    ParkingSpot(int id, SpotType t) : spotId(id), type(t), status(SpotStatus::AVAILABLE) {}
    
    bool isAvailable() const { return status == SpotStatus::AVAILABLE; }
    bool canFitVehicle(shared_ptr<Vehicle> vehicle) const {
        return isAvailable() && vehicle->canFitInSpot(type);
    }
    
    bool parkVehicle(shared_ptr<Vehicle> vehicle) {
        if (!canFitVehicle(vehicle)) {
            return false;
        }
        
        parkedVehicle = vehicle;
        status = SpotStatus::OCCUPIED;
        parkingStartTime = system_clock::now();
        
        cout << "Vehicle " << vehicle->getLicensePlate() 
             << " parked in spot " << spotId << endl;
        return true;
    }
    
    shared_ptr<Vehicle> removeVehicle() {
        if (status != SpotStatus::OCCUPIED) {
            return nullptr;
        }
        
        auto vehicle = parkedVehicle;
        parkedVehicle = nullptr;
        status = SpotStatus::AVAILABLE;
        
        cout << "Vehicle " << vehicle->getLicensePlate() 
             << " removed from spot " << spotId << endl;
        return vehicle;
    }
    
    double calculateParkingFee() const {
        if (status != SpotStatus::OCCUPIED) {
            return 0.0;
        }
        
        auto now = system_clock::now();
        auto duration = duration_cast<minutes>(now - parkingStartTime);
        int minutes = duration.count();
        
        // Different rates for different spot types
        double ratePerMinute = 0.0;
        switch (type) {
            case SpotType::COMPACT: ratePerMinute = 0.05; break;
            case SpotType::REGULAR: ratePerMinute = 0.10; break;
            case SpotType::LARGE: ratePerMinute = 0.15; break;
        }
        
        return minutes * ratePerMinute;
    }
    
    int getSpotId() const { return spotId; }
    SpotType getType() const { return type; }
    SpotStatus getStatus() const { return status; }
    shared_ptr<Vehicle> getParkedVehicle() const { return parkedVehicle; }
};

// Floor in parking lot
class ParkingFloor {
private:
    int floorNumber;
    vector<unique_ptr<ParkingSpot>> spots;
    map<SpotType, queue<int>> availableSpots; // spotType -> available spot IDs
    
public:
    ParkingFloor(int number, int compactSpots, int regularSpots, int largeSpots) 
        : floorNumber(number) {
        
        int spotId = floorNumber * 1000; // Floor 1: 1000-1999, Floor 2: 2000-2999, etc.
        
        // Create compact spots
        for (int i = 0; i < compactSpots; i++) {
            spots.push_back(make_unique<ParkingSpot>(spotId++, SpotType::COMPACT));
            availableSpots[SpotType::COMPACT].push(spots.back()->getSpotId());
        }
        
        // Create regular spots
        for (int i = 0; i < regularSpots; i++) {
            spots.push_back(make_unique<ParkingSpot>(spotId++, SpotType::REGULAR));
            availableSpots[SpotType::REGULAR].push(spots.back()->getSpotId());
        }
        
        // Create large spots
        for (int i = 0; i < largeSpots; i++) {
            spots.push_back(make_unique<ParkingSpot>(spotId++, SpotType::LARGE));
            availableSpots[SpotType::LARGE].push(spots.back()->getSpotId());
        }
    }
    
    ParkingSpot* findAvailableSpot(shared_ptr<Vehicle> vehicle) {
        // Try to find the most appropriate spot type
        vector<SpotType> preferredSpots;
        
        switch (vehicle->getType()) {
            case VehicleType::MOTORCYCLE:
                preferredSpots = {SpotType::COMPACT, SpotType::REGULAR, SpotType::LARGE};
                break;
            case VehicleType::CAR:
                preferredSpots = {SpotType::REGULAR, SpotType::LARGE};
                break;
            case VehicleType::TRUCK:
                preferredSpots = {SpotType::LARGE};
                break;
        }
        
        for (SpotType spotType : preferredSpots) {
            if (!availableSpots[spotType].empty()) {
                int spotId = availableSpots[spotType].front();
                availableSpots[spotType].pop();
                
                // Find the actual spot object
                for (auto& spot : spots) {
                    if (spot->getSpotId() == spotId) {
                        return spot.get();
                    }
                }
            }
        }
        
        return nullptr;
    }
    
    bool parkVehicle(shared_ptr<Vehicle> vehicle) {
        ParkingSpot* spot = findAvailableSpot(vehicle);
        if (spot == nullptr) {
            return false;
        }
        
        return spot->parkVehicle(vehicle);
    }
    
    bool removeVehicle(const string& licensePlate) {
        for (auto& spot : spots) {
            if (spot->getStatus() == SpotStatus::OCCUPIED && 
                spot->getParkedVehicle()->getLicensePlate() == licensePlate) {
                
                auto vehicle = spot->removeVehicle();
                if (vehicle) {
                    // Add spot back to available spots
                    availableSpots[spot->getType()].push(spot->getSpotId());
                    return true;
                }
            }
        }
        return false;
    }
    
    double calculateFee(const string& licensePlate) {
        for (auto& spot : spots) {
            if (spot->getStatus() == SpotStatus::OCCUPIED && 
                spot->getParkedVehicle()->getLicensePlate() == licensePlate) {
                return spot->calculateParkingFee();
            }
        }
        return 0.0;
    }
    
    void displayStatus() {
        cout << "Floor " << floorNumber << " Status:" << endl;
        cout << "Available Compact: " << availableSpots[SpotType::COMPACT].size() << endl;
        cout << "Available Regular: " << availableSpots[SpotType::REGULAR].size() << endl;
        cout << "Available Large: " << availableSpots[SpotType::LARGE].size() << endl;
    }
    
    int getFloorNumber() const { return floorNumber; }
};

// Main parking lot class
class ParkingLot {
private:
    string name;
    vector<unique_ptr<ParkingFloor>> floors;
    map<string, int> vehicleToFloor; // licensePlate -> floor number
    
public:
    ParkingLot(const string& lotName) : name(lotName) {}
    
    void addFloor(int compactSpots, int regularSpots, int largeSpots) {
        int floorNumber = floors.size() + 1;
        floors.push_back(make_unique<ParkingFloor>(floorNumber, compactSpots, regularSpots, largeSpots));
        cout << "Added floor " << floorNumber << " with " 
             << (compactSpots + regularSpots + largeSpots) << " spots" << endl;
    }
    
    bool parkVehicle(shared_ptr<Vehicle> vehicle) {
        // Try to park on each floor
        for (auto& floor : floors) {
            if (floor->parkVehicle(vehicle)) {
                vehicleToFloor[vehicle->getLicensePlate()] = floor->getFloorNumber();
                return true;
            }
        }
        
        cout << "No available spot for vehicle " << vehicle->getLicensePlate() << endl;
        return false;
    }
    
    bool removeVehicle(const string& licensePlate) {
        auto it = vehicleToFloor.find(licensePlate);
        if (it == vehicleToFloor.end()) {
            cout << "Vehicle " << licensePlate << " not found" << endl;
            return false;
        }
        
        int floorNumber = it->second;
        if (floors[floorNumber - 1]->removeVehicle(licensePlate)) {
            vehicleToFloor.erase(it);
            return true;
        }
        
        return false;
    }
    
    double calculateAndDisplayFee(const string& licensePlate) {
        auto it = vehicleToFloor.find(licensePlate);
        if (it == vehicleToFloor.end()) {
            cout << "Vehicle " << licensePlate << " not found" << endl;
            return 0.0;
        }
        
        int floorNumber = it->second;
        double fee = floors[floorNumber - 1]->calculateFee(licensePlate);
        cout << "Parking fee for " << licensePlate << ": $" << fee << endl;
        return fee;
    }
    
    void displayStatus() {
        cout << "\n=== " << name << " Status ===" << endl;
        for (auto& floor : floors) {
            floor->displayStatus();
        }
        cout << "Total parked vehicles: " << vehicleToFloor.size() << endl;
    }
};

// Factory for creating vehicles
class VehicleFactory {
public:
    static shared_ptr<Vehicle> createVehicle(VehicleType type, const string& licensePlate) {
        switch (type) {
            case VehicleType::MOTORCYCLE:
                return make_shared<Motorcycle>(licensePlate);
            case VehicleType::CAR:
                return make_shared<Car>(licensePlate);
            case VehicleType::TRUCK:
                return make_shared<Truck>(licensePlate);
            default:
                return nullptr;
        }
    }
};
```

### Usage Example:
```cpp
void demonstrateParkingLot() {
    ParkingLot lot("Downtown Parking");
    
    // Add floors
    lot.addFloor(10, 20, 5);  // Floor 1: 10 compact, 20 regular, 5 large
    lot.addFloor(15, 25, 8);  // Floor 2: 15 compact, 25 regular, 8 large
    
    // Create vehicles
    auto motorcycle1 = VehicleFactory::createVehicle(VehicleType::MOTORCYCLE, "M001");
    auto car1 = VehicleFactory::createVehicle(VehicleType::CAR, "C001");
    auto car2 = VehicleFactory::createVehicle(VehicleType::CAR, "C002");
    auto truck1 = VehicleFactory::createVehicle(VehicleType::TRUCK, "T001");
    
    // Park vehicles
    lot.parkVehicle(motorcycle1);
    lot.parkVehicle(car1);
    lot.parkVehicle(car2);
    lot.parkVehicle(truck1);
    
    lot.displayStatus();
    
    // Simulate some time passing and calculate fees
    this_thread::sleep_for(chrono::seconds(2));
    
    lot.calculateAndDisplayFee("C001");
    lot.calculateAndDisplayFee("T001");
    
    // Remove vehicles
    lot.removeVehicle("C001");
    lot.removeVehicle("M001");
    
    lot.displayStatus();
}
```

---

## 🏢 PROBLEM 2: ELEVATOR SYSTEM

### Problem Statement
Design an elevator system that can:
- Handle multiple elevators in a building
- Efficiently schedule elevator requests
- Support different types of requests (internal, external)
- Optimize for minimal wait time
- Handle emergency situations

### Solution Approach

```cpp
#include <set>
#include <algorithm>

enum class Direction {
    UP,
    DOWN,
    IDLE
};

enum class ElevatorState {
    MOVING,
    STOPPED,
    MAINTENANCE
};

// Request class
class Request {
private:
    int floor;
    Direction direction;
    time_point<system_clock> timestamp;
    
public:
    Request(int f, Direction d) : floor(f), direction(d), timestamp(system_clock::now()) {}
    
    int getFloor() const { return floor; }
    Direction getDirection() const { return direction; }
    time_point<system_clock> getTimestamp() const { return timestamp; }
};

// Elevator class
class Elevator {
private:
    int elevatorId;
    int currentFloor;
    Direction currentDirection;
    ElevatorState state;
    set<int> upRequests;    // Floors to visit going up
    set<int> downRequests;  // Floors to visit going down
    int capacity;
    int currentLoad;
    
public:
    Elevator(int id, int startFloor = 1, int cap = 10) 
        : elevatorId(id), currentFloor(startFloor), currentDirection(Direction::IDLE),
          state(ElevatorState::STOPPED), capacity(cap), currentLoad(0) {}
    
    void addRequest(int floor, Direction direction) {
        if (direction == Direction::UP || floor > currentFloor) {
            upRequests.insert(floor);
        } else {
            downRequests.insert(floor);
        }
        
        cout << "Elevator " << elevatorId << " received request for floor " << floor << endl;
    }
    
    void move() {
        if (state == ElevatorState::MAINTENANCE) {
            return;
        }
        
        // Determine next floor to visit
        int nextFloor = getNextFloor();
        if (nextFloor == -1) {
            currentDirection = Direction::IDLE;
            state = ElevatorState::STOPPED;
            return;
        }
        
        // Move towards next floor
        state = ElevatorState::MOVING;
        if (nextFloor > currentFloor) {
            currentDirection = Direction::UP;
            currentFloor++;
        } else if (nextFloor < currentFloor) {
            currentDirection = Direction::DOWN;
            currentFloor--;
        }
        
        cout << "Elevator " << elevatorId << " moving to floor " << currentFloor 
             << " (direction: " << (currentDirection == Direction::UP ? "UP" : "DOWN") << ")" << endl;
        
        // Check if we've reached a requested floor
        if (currentFloor == nextFloor) {
            handleArrival();
        }
    }
    
private:
    int getNextFloor() {
        if (currentDirection == Direction::UP || currentDirection == Direction::IDLE) {
            // Check upward requests first
            auto it = upRequests.lower_bound(currentFloor);
            if (it != upRequests.end()) {
                return *it;
            }
            
            // If no upward requests, check downward requests
            if (!downRequests.empty()) {
                return *downRequests.rbegin(); // Highest floor in down requests
            }
        } else if (currentDirection == Direction::DOWN) {
            // Check downward requests first
            auto it = downRequests.upper_bound(currentFloor);
            if (it != downRequests.begin()) {
                --it;
                return *it;
            }
            
            // If no downward requests, check upward requests
            if (!upRequests.empty()) {
                return *upRequests.begin(); // Lowest floor in up requests
            }
        }
        
        return -1; // No requests
    }
    
    void handleArrival() {
        cout << "Elevator " << elevatorId << " arrived at floor " << currentFloor << endl;
        
        // Remove current floor from requests
        upRequests.erase(currentFloor);
        downRequests.erase(currentFloor);
        
        // Simulate door opening and closing
        state = ElevatorState::STOPPED;
        cout << "Doors opening at floor " << currentFloor << endl;
        
        // Simulate passenger exchange
        this_thread::sleep_for(chrono::milliseconds(100));
        
        cout << "Doors closing at floor " << currentFloor << endl;
    }
    
public:
    // Getters
    int getCurrentFloor() const { return currentFloor; }
    Direction getCurrentDirection() const { return currentDirection; }
    ElevatorState getState() const { return state; }
    int getElevatorId() const { return elevatorId; }
    
    bool isIdle() const {
        return upRequests.empty() && downRequests.empty() && state == ElevatorState::STOPPED;
    }
    
    int getDistance(int floor) const {
        return abs(currentFloor - floor);
    }
    
    bool isMovingTowards(int floor) const {
        if (currentDirection == Direction::UP && floor > currentFloor) {
            return true;
        }
        if (currentDirection == Direction::DOWN && floor < currentFloor) {
            return true;
        }
        return false;
    }
    
    void displayStatus() const {
        cout << "Elevator " << elevatorId << ": Floor " << currentFloor 
             << ", Direction: ";
        switch (currentDirection) {
            case Direction::UP: cout << "UP"; break;
            case Direction::DOWN: cout << "DOWN"; break;
            case Direction::IDLE: cout << "IDLE"; break;
        }
        cout << ", State: ";
        switch (state) {
            case ElevatorState::MOVING: cout << "MOVING"; break;
            case ElevatorState::STOPPED: cout << "STOPPED"; break;
            case ElevatorState::MAINTENANCE: cout << "MAINTENANCE"; break;
        }
        cout << endl;
    }
};

// Elevator controller
class ElevatorController {
private:
    vector<unique_ptr<Elevator>> elevators;
    queue<Request> pendingRequests;
    int totalFloors;
    
public:
    ElevatorController(int numElevators, int floors) : totalFloors(floors) {
        for (int i = 0; i < numElevators; i++) {
            elevators.push_back(make_unique<Elevator>(i + 1));
        }
        cout << "Elevator system initialized with " << numElevators 
             << " elevators and " << floors << " floors" << endl;
    }
    
    void requestElevator(int floor, Direction direction) {
        if (floor < 1 || floor > totalFloors) {
            cout << "Invalid floor: " << floor << endl;
            return;
        }
        
        Elevator* bestElevator = findBestElevator(floor, direction);
        if (bestElevator) {
            bestElevator->addRequest(floor, direction);
        } else {
            pendingRequests.push(Request(floor, direction));
            cout << "All elevators busy, request queued for floor " << floor << endl;
        }
    }
    
    void requestFloor(int elevatorId, int floor) {
        if (elevatorId < 1 || elevatorId > elevators.size()) {
            cout << "Invalid elevator ID: " << elevatorId << endl;
            return;
        }
        
        if (floor < 1 || floor > totalFloors) {
            cout << "Invalid floor: " << floor << endl;
            return;
        }
        
        Direction direction = (floor > elevators[elevatorId - 1]->getCurrentFloor()) ? 
                             Direction::UP : Direction::DOWN;
        elevators[elevatorId - 1]->addRequest(floor, direction);
    }
    
    void step() {
        // Move all elevators
        for (auto& elevator : elevators) {
            elevator->move();
        }
        
        // Process pending requests
        processPendingRequests();
    }
    
private:
    Elevator* findBestElevator(int floor, Direction direction) {
        Elevator* bestElevator = nullptr;
        int minCost = INT_MAX;
        
        for (auto& elevator : elevators) {
            if (elevator->getState() == ElevatorState::MAINTENANCE) {
                continue;
            }
            
            int cost = calculateCost(elevator.get(), floor, direction);
            if (cost < minCost) {
                minCost = cost;
                bestElevator = elevator.get();
            }
        }
        
        return bestElevator;
    }
    
    int calculateCost(Elevator* elevator, int floor, Direction direction) {
        int distance = elevator->getDistance(floor);
        
        // Prefer elevators that are idle
        if (elevator->isIdle()) {
            return distance;
        }
        
        // Prefer elevators moving in the same direction towards the floor
        if (elevator->isMovingTowards(floor) && 
            elevator->getCurrentDirection() == direction) {
            return distance;
        }
        
        // Higher cost for elevators moving away or in opposite direction
        return distance + 100;
    }
    
    void processPendingRequests() {
        while (!pendingRequests.empty()) {
            Request request = pendingRequests.front();
            Elevator* bestElevator = findBestElevator(request.getFloor(), request.getDirection());
            
            if (bestElevator) {
                bestElevator->addRequest(request.getFloor(), request.getDirection());
                pendingRequests.pop();
            } else {
                break; // No available elevator, keep request in queue
            }
        }
    }
    
public:
    void displayStatus() {
        cout << "\n=== Elevator System Status ===" << endl;
        for (auto& elevator : elevators) {
            elevator->displayStatus();
        }
        cout << "Pending requests: " << pendingRequests.size() << endl;
    }
    
    void simulate(int steps) {
        cout << "\n=== Starting Elevator Simulation ===" << endl;
        for (int i = 0; i < steps; i++) {
            cout << "\n--- Step " << (i + 1) << " ---" << endl;
            step();
            this_thread::sleep_for(chrono::milliseconds(200));
        }
    }
};
```

### Usage Example:
```cpp
void demonstrateElevatorSystem() {
    ElevatorController controller(3, 10); // 3 elevators, 10 floors
    
    // External requests (people calling elevators)
    controller.requestElevator(5, Direction::UP);
    controller.requestElevator(3, Direction::DOWN);
    controller.requestElevator(8, Direction::UP);
    
    // Internal requests (people inside elevators pressing floor buttons)
    controller.requestFloor(1, 7);  // Person in elevator 1 wants to go to floor 7
    controller.requestFloor(2, 1);  // Person in elevator 2 wants to go to floor 1
    
    controller.displayStatus();
    
    // Simulate elevator movement
    controller.simulate(20);
    
    controller.displayStatus();
}
```

---

## ♟️ PROBLEM 3: CHESS GAME

### Problem Statement
Design a chess game system that can:
- Represent the chess board and pieces
- Validate moves according to chess rules
- Track game state (check, checkmate, stalemate)
- Support different game modes (human vs human, human vs AI)
- Handle special moves (castling, en passant, promotion)

### Solution Approach

```cpp
enum class PieceColor {
    WHITE,
    BLACK
};

enum class PieceType {
    KING,
    QUEEN,
    ROOK,
    BISHOP,
    KNIGHT,
    PAWN
};

enum class GameState {
    ACTIVE,
    CHECK,
    CHECKMATE,
    STALEMATE,
    DRAW
};

// Position on chess board
struct Position {
    int row, col;
    
    Position(int r = 0, int c = 0) : row(r), col(c) {}
    
    bool isValid() const {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    bool operator==(const Position& other) const {
        return row == other.row && col == other.col;
    }
    
    string toString() const {
        return string(1, 'a' + col) + to_string(row + 1);
    }
};

// Abstract piece class
class Piece {
protected:
    PieceColor color;
    PieceType type;
    bool hasMoved;
    
public:
    Piece(PieceColor c, PieceType t) : color(c), type(t), hasMoved(false) {}
    virtual ~Piece() = default;
    
    PieceColor getColor() const { return color; }
    PieceType getType() const { return type; }
    bool hasMovedBefore() const { return hasMoved; }
    void setMoved() { hasMoved = true; }
    
    virtual vector<Position> getPossibleMoves(const Position& from, class ChessBoard& board) const = 0;
    virtual bool canMoveTo(const Position& from, const Position& to, class ChessBoard& board) const = 0;
    virtual char getSymbol() const = 0;
    virtual unique_ptr<Piece> clone() const = 0;
};

// Forward declaration
class ChessBoard;

// Concrete piece implementations
class King : public Piece {
public:
    King(PieceColor c) : Piece(c, PieceType::KING) {}
    
    vector<Position> getPossibleMoves(const Position& from, ChessBoard& board) const override;
    bool canMoveTo(const Position& from, const Position& to, ChessBoard& board) const override;
    char getSymbol() const override { return (color == PieceColor::WHITE) ? 'K' : 'k'; }
    unique_ptr<Piece> clone() const override { return make_unique<King>(color); }
};

class Queen : public Piece {
public:
    Queen(PieceColor c) : Piece(c, PieceType::QUEEN) {}
    
    vector<Position> getPossibleMoves(const Position& from, ChessBoard& board) const override;
    bool canMoveTo(const Position& from, const Position& to, ChessBoard& board) const override;
    char getSymbol() const override { return (color == PieceColor::WHITE) ? 'Q' : 'q'; }
    unique_ptr<Piece> clone() const override { return make_unique<Queen>(color); }
};

class Rook : public Piece {
public:
    Rook(PieceColor c) : Piece(c, PieceType::ROOK) {}
    
    vector<Position> getPossibleMoves(const Position& from, ChessBoard& board) const override;
    bool canMoveTo(const Position& from, const Position& to, ChessBoard& board) const override;
    char getSymbol() const override { return (color == PieceColor::WHITE) ? 'R' : 'r'; }
    unique_ptr<Piece> clone() const override { return make_unique<Rook>(color); }
};

class Bishop : public Piece {
public:
    Bishop(PieceColor c) : Piece(c, PieceType::BISHOP) {}
    
    vector<Position> getPossibleMoves(const Position& from, ChessBoard& board) const override;
    bool canMoveTo(const Position& from, const Position& to, ChessBoard& board) const override;
    char getSymbol() const override { return (color == PieceColor::WHITE) ? 'B' : 'b'; }
    unique_ptr<Piece> clone() const override { return make_unique<Bishop>(color); }
};

class Knight : public Piece {
public:
    Knight(PieceColor c) : Piece(c, PieceType::KNIGHT) {}
    
    vector<Position> getPossibleMoves(const Position& from, ChessBoard& board) const override;
    bool canMoveTo(const Position& from, const Position& to, ChessBoard& board) const override;
    char getSymbol() const override { return (color == PieceColor::WHITE) ? 'N' : 'n'; }
    unique_ptr<Piece> clone() const override { return make_unique<Knight>(color); }
};

class Pawn : public Piece {
public:
    Pawn(PieceColor c) : Piece(c, PieceType::PAWN) {}
    
    vector<Position> getPossibleMoves(const Position& from, ChessBoard& board) const override;
    bool canMoveTo(const Position& from, const Position& to, ChessBoard& board) const override;
    char getSymbol() const override { return (color == PieceColor::WHITE) ? 'P' : 'p'; }
    unique_ptr<Piece> clone() const override { return make_unique<Pawn>(color); }
};

// Chess board
class ChessBoard {
private:
    unique_ptr<Piece> board[8][8];
    
public:
    ChessBoard() {
        initializeBoard();
    }
    
    void initializeBoard() {
        // Clear board
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                board[i][j] = nullptr;
            }
        }
        
        // Place white pieces
        board[0][0] = make_unique<Rook>(PieceColor::WHITE);
        board[0][1] = make_unique<Knight>(PieceColor::WHITE);
        board[0][2] = make_unique<Bishop>(PieceColor::WHITE);
        board[0][3] = make_unique<Queen>(PieceColor::WHITE);
        board[0][4] = make_unique<King>(PieceColor::WHITE);
        board[0][5] = make_unique<Bishop>(PieceColor::WHITE);
        board[0][6] = make_unique<Knight>(PieceColor::WHITE);
        board[0][7] = make_unique<Rook>(PieceColor::WHITE);
        
        for (int i = 0; i < 8; i++) {
            board[1][i] = make_unique<Pawn>(PieceColor::WHITE);
        }
        
        // Place black pieces
        board[7][0] = make_unique<Rook>(PieceColor::BLACK);
        board[7][1] = make_unique<Knight>(PieceColor::BLACK);
        board[7][2] = make_unique<Bishop>(PieceColor::BLACK);
        board[7][3] = make_unique<Queen>(PieceColor::BLACK);
        board[7][4] = make_unique<King>(PieceColor::BLACK);
        board[7][5] = make_unique<Bishop>(PieceColor::BLACK);
        board[7][6] = make_unique<Knight>(PieceColor::BLACK);
        board[7][7] = make_unique<Rook>(PieceColor::BLACK);
        
        for (int i = 0; i < 8; i++) {
            board[6][i] = make_unique<Pawn>(PieceColor::BLACK);
        }
    }
    
    Piece* getPiece(const Position& pos) const {
        if (!pos.isValid()) return nullptr;
        return board[pos.row][pos.col].get();
    }
    
    bool isEmpty(const Position& pos) const {
        return getPiece(pos) == nullptr;
    }
    
    bool isEnemyPiece(const Position& pos, PieceColor color) const {
        Piece* piece = getPiece(pos);
        return piece != nullptr && piece->getColor() != color;
    }
    
    bool movePiece(const Position& from, const Position& to) {
        if (!from.isValid() || !to.isValid()) return false;
        
        Piece* piece = getPiece(from);
        if (!piece) return false;
        
        if (!piece->canMoveTo(from, to, *this)) return false;
        
        // Make the move
        board[to.row][to.col] = move(board[from.row][from.col]);
        board[from.row][from.col] = nullptr;
        
        piece->setMoved();
        return true;
    }
    
    void display() const {
        cout << "\n  a b c d e f g h" << endl;
        for (int row = 7; row >= 0; row--) {
            cout << (row + 1) << " ";
            for (int col = 0; col < 8; col++) {
                if (board[row][col]) {
                    cout << board[row][col]->getSymbol() << " ";
                } else {
                    cout << ". ";
                }
            }
            cout << (row + 1) << endl;
        }
        cout << "  a b c d e f g h\n" << endl;
    }
    
    Position findKing(PieceColor color) const {
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                Piece* piece = board[row][col].get();
                if (piece && piece->getType() == PieceType::KING && piece->getColor() == color) {
                    return Position(row, col);
                }
            }
        }
        return Position(-1, -1); // Should never happen in a valid game
    }
    
    bool isInCheck(PieceColor color) const {
        Position kingPos = findKing(color);
        if (!kingPos.isValid()) return false;
        
        // Check if any enemy piece can attack the king
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                Piece* piece = board[row][col].get();
                if (piece && piece->getColor() != color) {
                    if (piece->canMoveTo(Position(row, col), kingPos, const_cast<ChessBoard&>(*this))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};

// Game class
class ChessGame {
private:
    ChessBoard board;
    PieceColor currentPlayer;
    GameState gameState;
    vector<string> moveHistory;
    
public:
    ChessGame() : currentPlayer(PieceColor::WHITE), gameState(GameState::ACTIVE) {}
    
    bool makeMove(const string& from, const string& to) {
        Position fromPos = parsePosition(from);
        Position toPos = parsePosition(to);
        
        if (!fromPos.isValid() || !toPos.isValid()) {
            cout << "Invalid position format" << endl;
            return false;
        }
        
        Piece* piece = board.getPiece(fromPos);
        if (!piece) {
            cout << "No piece at " << from << endl;
            return false;
        }
        
        if (piece->getColor() != currentPlayer) {
            cout << "Not your piece!" << endl;
            return false;
        }
        
        if (board.movePiece(fromPos, toPos)) {
            string move = from + "-" + to;
            moveHistory.push_back(move);
            
            // Switch players
            currentPlayer = (currentPlayer == PieceColor::WHITE) ? PieceColor::BLACK : PieceColor::WHITE;
            
            // Check game state
            updateGameState();
            
            cout << "Move: " << move << endl;
            return true;
        } else {
            cout << "Invalid move!" << endl;
            return false;
        }
    }
    
    void displayBoard() const {
        board.display();
    }
    
    void displayGameInfo() const {
        cout << "Current player: " << (currentPlayer == PieceColor::WHITE ? "White" : "Black") << endl;
        cout << "Game state: ";
        switch (gameState) {
            case GameState::ACTIVE: cout << "Active"; break;
            case GameState::CHECK: cout << "Check"; break;
            case GameState::CHECKMATE: cout << "Checkmate"; break;
            case GameState::STALEMATE: cout << "Stalemate"; break;
            case GameState::DRAW: cout << "Draw"; break;
        }
        cout << endl;
    }
    
private:
    Position parsePosition(const string& pos) const {
        if (pos.length() != 2) return Position(-1, -1);
        
        int col = pos[0] - 'a';
        int row = pos[1] - '1';
        
        return Position(row, col);
    }
    
    void updateGameState() {
        if (board.isInCheck(currentPlayer)) {
            gameState = GameState::CHECK;
            cout << (currentPlayer == PieceColor::WHITE ? "White" : "Black") << " is in check!" << endl;
        } else {
            gameState = GameState::ACTIVE;
        }
    }
};
```

### Usage Example:
```cpp
void demonstrateChessGame() {
    ChessGame game;
    
    cout << "=== Chess Game Started ===" << endl;
    game.displayBoard();
    game.displayGameInfo();
    
    // Make some moves
    game.makeMove("e2", "e4");  // White pawn
    game.displayBoard();
    
    game.makeMove("e7", "e5");  // Black pawn
    game.displayBoard();
    
    game.makeMove("g1", "f3");  // White knight
    game.displayBoard();
    
    game.makeMove("b8", "c6");  // Black knight
    game.displayBoard();
    
    game.displayGameInfo();
}
```

---

## 🎮 More LLD Interview Problems

### Problem 4: ATM Machine
- Card validation and PIN verification
- Account balance checking
- Cash withdrawal with denomination management
- Transaction logging and receipt generation

### Problem 5: Library Management System
- Book catalog with search functionality
- Member registration and management
- Book borrowing and return system
- Fine calculation for overdue books

### Problem 6: Online Chat System
- User authentication and presence
- One-on-one and group messaging
- Message history and persistence
- Real-time notifications

### Problem 7: Vending Machine
- Product inventory management
- Payment processing (coins, bills, cards)
- Change calculation and dispensing
- Maintenance and restocking alerts

---

## 🎯 LLD Interview Tips

### 1. **Clarify Requirements**
```cpp
// Always ask clarifying questions:
// - What are the main use cases?
// - What's the expected scale?
// - Are there any specific constraints?
// - What are the performance requirements?
```

### 2. **Start with High-Level Design**
```cpp
// Begin with main entities and relationships:
// - Identify core objects
// - Define relationships between objects
// - Think about the main workflows
```

### 3. **Apply Design Patterns**
```cpp
// Use appropriate design patterns:
// - Factory for object creation
// - Strategy for different algorithms
// - Observer for event handling
// - State for state management
```

### 4. **Focus on Extensibility**
```cpp
// Design for future requirements:
// - Use interfaces and abstract classes
// - Follow SOLID principles
// - Make the system configurable
// - Plan for new features
```

### 5. **Handle Edge Cases**
```cpp
// Consider error scenarios:
// - Invalid inputs
// - System failures
// - Concurrent access
// - Resource limitations
```

---

## ⚡ Key Takeaways

1. **Think in objects** - Identify entities and their relationships
2. **Start simple** - Begin with core functionality, then add complexity
3. **Use design patterns** - Apply proven solutions to common problems
4. **Plan for extensibility** - Design systems that can grow and change
5. **Consider real-world constraints** - Think about performance, scalability, and edge cases
6. **Practice regularly** - The more problems you solve, the better you become

## 🎯 Next Steps

- Practice implementing these problems from scratch
- Study existing system designs in open-source projects
- Learn about system design patterns and architectural styles
- Practice explaining your design decisions clearly
- Prepare for follow-up questions about scalability and optimization

---
*"Great design is not just about solving today's problems, but anticipating tomorrow's challenges!"* 🚀
