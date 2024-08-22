-- Create Database
CREATE Database crudproductos;

-- Use DATABASE
use crudproductos;

-- creating table users
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `status` tinyint DEFAULT '1'
);

-- creating table products
CREATE TABLE `producto` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` varchar(100) NOT NULL,
  `urlImagen` varchar(100) NOT NULL,
  `precio` float NOT NULL
);

-- to show all tables
show tables;

-- to describe table
describe producto;
describe usuarios;