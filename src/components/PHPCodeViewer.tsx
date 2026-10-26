import React, { useState } from 'react';

const PHPCodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'php' | 'sql' | 'api'>('php');

  const phpCode = `<?php
// ============================================
// config/database.php - Database Connection
// ============================================
<?php
class Database {
    private $host = "localhost";
    private $db_name = "crud_app";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
        }
        return $this->conn;
    }
}

// ============================================
// models/User.php - User Model
// ============================================
class User {
    private $conn;
    private $table = "users";

    public $id;
    public $name;
    public $email;
    public $phone;
    public $address;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // READ - Get All Users
    public function readAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ - Get Single User
    public function readOne() {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->address = $row['address'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }

    // CREATE - Create New User
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET name=:name, email=:email, phone=:phone, address=:address";
        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->address = htmlspecialchars(strip_tags($this->address));

        // Bind parameters
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // UPDATE - Update User
    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET name=:name, email=:email, phone=:phone, address=:address 
                  WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->address = htmlspecialchars(strip_tags($this->address));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE - Delete User
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}`;

  const sqlCode = `-- ============================================
-- SQL - Database Setup
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS crud_app;
USE crud_app;

-- Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Sample Data
INSERT INTO users (name, email, phone, address) VALUES
('John Doe', 'john@example.com', '+1 234 567 890', '123 Main St, New York, NY'),
('Jane Smith', 'jane@example.com', '+1 345 678 901', '456 Oak Ave, Los Angeles, CA'),
('Bob Johnson', 'bob@example.com', '+1 456 789 012', '789 Pine Rd, Chicago, IL'),
('Alice Williams', 'alice@example.com', '+1 567 890 123', '321 Elm St, Houston, TX'),
('Charlie Brown', 'charlie@example.com', '+1 678 901 234', '654 Maple Dr, Phoenix, AZ');`;

  const apiCode = `<?php
// ============================================
// api/users.php - REST API Endpoints
// ============================================
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get request method
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri_parts = explode('/', $uri);

// Get ID from URL if exists
$id = isset($uri_parts[3]) ? $uri_parts[3] : null;

switch ($method) {
    // READ ALL - GET /api/users
    case 'GET':
        if ($id) {
            $user->id = $id;
            if ($user->readOne()) {
                $user_arr = array(
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "phone" => $user->phone,
                    "address" => $user->address,
                    "created_at" => $user->created_at
                );
                http_response_code(200);
                echo json_encode($user_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "User not found."));
            }
        } else {
            $stmt = $user->readAll();
            $users_arr = array();
            $users_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $user_item = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "phone" => $row['phone'],
                    "address" => $row['address'],
                    "created_at" => $row['created_at']
                );
                array_push($users_arr["records"], $user_item);
            }

            http_response_code(200);
            echo json_encode($users_arr);
        }
        break;

    // CREATE - POST /api/users
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->name) && !empty($data->email) && 
            !empty($data->phone) && !empty($data->address)) {
            
            $user->name = $data->name;
            $user->email = $data->email;
            $user->phone = $data->phone;
            $user->address = $data->address;

            if ($user->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "User created successfully.",
                    "id" => $user->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create user."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
        break;

    // UPDATE - PUT /api/users/{id}
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $user->id = $data->id ?? $id;

        if (!empty($data->name) && !empty($data->email) && 
            !empty($data->phone) && !empty($data->address)) {
            
            $user->name = $data->name;
            $user->email = $data->email;
            $user->phone = $data->phone;
            $user->address = $data->address;

            if ($user->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "User updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update user."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
        break;

    // DELETE - DELETE /api/users/{id}
    case 'DELETE':
        $user->id = isset($_GET['id']) ? $_GET['id'] : $id;

        if ($user->id) {
            if ($user->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "User deleted successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete user."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "User ID is required."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}`;

  const reactApiCode = `// ============================================
// React Frontend - API Service (src/services/api.ts)
// ============================================
import { User, UserFormData } from '../types';

const API_URL = 'http://localhost/api/users';

export const api = {
  // READ - GET all users
  getAll: async (): Promise<User[]> => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.records || [];
  },

  // READ - GET single user
  getById: async (id: number): Promise<User> => {
    const response = await fetch(\`\${API_URL}/\${id}\`);
    return response.json();
  },

  // CREATE - POST new user
  create: async (userData: UserFormData): Promise<User> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // UPDATE - PUT update user
  update: async (id: number, userData: UserFormData): Promise<User> => {
    const response = await fetch(\`\${API_URL}/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...userData }),
    });
    return response.json();
  },

  // DELETE - DELETE user
  delete: async (id: number): Promise<void> => {
    await fetch(\`\${API_URL}/\${id}\`, {
      method: 'DELETE',
    });
  },
};`;

  const tabs = [
    { id: 'php' as const, label: '🐘 PHP Backend', icon: 'PHP' },
    { id: 'sql' as const, label: '🗄️ MySQL Schema', icon: 'SQL' },
    { id: 'api' as const, label: '🔌 REST API', icon: 'API' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
          <code>
            {activeTab === 'php' && phpCode}
            {activeTab === 'sql' && sqlCode}
            {activeTab === 'api' && (apiCode + '\n\n' + reactApiCode)}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default PHPCodeViewer;
