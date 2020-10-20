<?php
    class Hero {
    
        // database connection and table name
        private $conn;
        private $table_name = "hero";
   
        // object properties
        public $id;
        public $name;
        public $class;
        public $battlepoint_cost;
        public $diamond_cost;
        public $movement_speed;
        public $physical_attack;
        public $physical_defense;
        public $magic_power;
        public $armor;
        public $magic_resistance;
        public $hp;
        public $mana;
        public $attack_speed;
        public $hp_regen_rate;
        public $mana_regen_rate;
        public $img_profile_url;
        public $description;
            
        // constructor with $db as database connection
        public function __construct($db) {
            $this->conn = $db;
        }

        // read stars
        public function read() {
        
            // select all query
            $query = "SELECT
                            *
                        FROM
                            hero";

        
            // prepare query statement
            $stmt = $this->conn->prepare($query);
        
            // execute query
            $stmt->execute();
        
            return $stmt;
        }

        // search by class
        public function search_by_class($search_term) {
        
            // select all query
            $query = "SELECT
                        *
                        FROM
                            hero
                        WHERE
                            class = ?
                        ORDER BY
                            id";
        
            // prepare query statement
            $stmt = $this->conn->prepare($query);
                
            // bind
            $stmt->bindParam(1, $search_term);
        
            // execute query
            $stmt->execute();
        
            return $stmt;
        }
    }
?>