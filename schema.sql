CREATE DATABASE IF NOT EXISTS `cs336project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cs336project`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cs336project
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bids_on`
--

DROP TABLE IF EXISTS `bids_on`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bids_on` (
  `bid_id` int NOT NULL,
  `auction_id` int DEFAULT NULL,
  `bidder_id` int DEFAULT NULL,
  `upper_limit` float DEFAULT NULL,
  `is_Highest` tinyint(1) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `when_placed` datetime DEFAULT NULL,
  PRIMARY KEY (`bid_id`),
  KEY `auction_id` (`auction_id`),
  KEY `bidder_id` (`bidder_id`),
  CONSTRAINT `bids_on_ibfk_1` FOREIGN KEY (`auction_id`) REFERENCES `posted_auction` (`auction_id`),
  CONSTRAINT `bids_on_ibfk_2` FOREIGN KEY (`bidder_id`) REFERENCES `end_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bids_on`
--

LOCK TABLES `bids_on` WRITE;
/*!40000 ALTER TABLE `bids_on` DISABLE KEYS */;
/*!40000 ALTER TABLE `bids_on` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `end_user`
--

DROP TABLE IF EXISTS `end_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `end_user` (
  `user_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(5) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(15) DEFAULT NULL,
  `prev_auctions` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end_user`
--

LOCK TABLES `end_user` WRITE;
/*!40000 ALTER TABLE `end_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `end_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inlcuded_item`
--

DROP TABLE IF EXISTS `inlcuded_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inlcuded_item` (
  `item_id` int NOT NULL,
  `auction_id` int NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `auction_id` (`auction_id`),
  CONSTRAINT `inlcuded_item_ibfk_1` FOREIGN KEY (`auction_id`) REFERENCES `posted_auction` (`auction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inlcuded_item`
--

LOCK TABLES `inlcuded_item` WRITE;
/*!40000 ALTER TABLE `inlcuded_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `inlcuded_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_alert_set`
--

DROP TABLE IF EXISTS `item_alert_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_alert_set` (
  `alert_id` int NOT NULL,
  `buyer_id` int DEFAULT NULL,
  `key_terms` varchar(75) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `notify_method` varchar(25) DEFAULT NULL,
  `was_triggered` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`alert_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `item_alert_set_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `end_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_alert_set`
--

LOCK TABLES `item_alert_set` WRITE;
/*!40000 ALTER TABLE `item_alert_set` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_alert_set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posted_auction`
--

DROP TABLE IF EXISTS `posted_auction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posted_auction` (
  `auction_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `when_closes` datetime DEFAULT NULL,
  `history_of_bids` varchar(500) DEFAULT NULL,
  `status` char(6) DEFAULT 'Open',
  `bid_increment` int DEFAULT NULL,
  `imageCount` int DEFAULT 0,
  PRIMARY KEY (`auction_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `posted_auction_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `end_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posted_auction`
--

LOCK TABLES `posted_auction` WRITE;
/*!40000 ALTER TABLE `posted_auction` DISABLE KEYS */;
/*!40000 ALTER TABLE `posted_auction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-14 20:57:06

insert into end_user values (user_id, username, password, name, email, role, prev_auctions), (1,'user', 'pass', 'tati', 'email', 'ADMIN', NULL);
select * from end_user; 