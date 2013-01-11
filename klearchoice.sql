-- MySQL dump 10.13  Distrib 5.5.22, for Win32 (x86)
--
-- Host: localhost    Database: klearchoice
-- ------------------------------------------------------
-- Server version	5.5.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `charity`
--

DROP TABLE IF EXISTS `charity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `charity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `charity_name` varchar(100) DEFAULT NULL,
  `address1` varchar(200) DEFAULT NULL,
  `address2` varchar(200) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `mailing_address1` varchar(200) DEFAULT NULL,
  `mailing_address2` varchar(200) DEFAULT NULL,
  `mailing_city` varchar(45) DEFAULT NULL,
  `mailing_state` varchar(45) DEFAULT NULL,
  `mailing_zip` varchar(10) DEFAULT NULL,
  `dwolla_id` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `dob` varchar(20) DEFAULT NULL,
  `ein` varchar(20) DEFAULT NULL,
  `board_type` varchar(200) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity`
--

LOCK TABLES `charity` WRITE;
/*!40000 ALTER TABLE `charity` DISABLE KEYS */;
INSERT INTO `charity` VALUES (1,'Test Charity','111 Test Address Rd',NULL,'Grapevine','TX','76051',NULL,NULL,NULL,NULL,NULL,'812-708-2911',NULL,NULL,NULL,NULL,NULL,NULL,'localhost',NULL,NULL,NULL,'2012-07-13 18:20:30');
/*!40000 ALTER TABLE `charity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donor`
--

DROP TABLE IF EXISTS `donor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `donor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `city` varchar(200) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `processor_id` varchar(45) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor`
--

LOCK TABLES `donor` WRITE;
/*!40000 ALTER TABLE `donor` DISABLE KEYS */;
INSERT INTO `donor` VALUES (1,'Clayton Gulick','','Grapevine','TX','812-631-7173','2012-07-18 21:13:29');
/*!40000 ALTER TABLE `donor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `donor_id` int(11) DEFAULT NULL,
  `charity_id` int(11) DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `klearchoice_fee` decimal(8,2) DEFAULT NULL,
  `processor_fee` decimal(8,2) DEFAULT NULL,
  `confirmation_number` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,0,1,12.00,0.00,0.00,'','error','Unknown response received from payment gateway. Please try again later.',NULL),(2,0,1,12.00,0.00,0.00,'','error','Unknown response received from payment gateway. Please try again later.',NULL),(3,0,1,12.00,0.00,0.00,'','error','Invalid account PIN',NULL),(4,0,1,12.00,0.00,0.00,'','error','Insufficient funds.',NULL),(5,0,1,123.00,0.00,0.00,'','error','Invalid account PIN',NULL),(6,0,1,123.00,0.00,0.00,'','error','Insufficient funds.',NULL),(7,0,1,12.00,0.00,0.00,'','error','Invalid account PIN','2012-07-18 20:14:33'),(8,NULL,1,12.00,NULL,NULL,'','error','Invalid account PIN','2012-07-18 21:13:35'),(9,NULL,1,12.00,NULL,NULL,'','error','Insufficient funds.','2012-07-18 21:30:58'),(10,1,1,12.00,NULL,NULL,'','error','Insufficient funds.','2012-07-18 21:33:51'),(11,1,1,12.00,0.20,0.25,'','error','Insufficient funds.','2012-07-18 21:35:21'),(12,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-07-19 19:58:04'),(13,1,1,12.00,0.20,0.25,'','error','Insufficient funds.','2012-07-19 19:58:09'),(14,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-07-19 20:20:52'),(15,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-07-19 20:32:36'),(16,1,1,12.00,0.20,0.25,'','error','There was a problem communicating with the payment gateway. Please try again later.','2012-07-23 18:00:10'),(17,1,1,12.00,0.20,0.25,'','error','Insufficient funds.','2012-07-23 18:08:42'),(18,1,1,12.00,0.20,0.25,'','error','Insufficient funds.','2012-07-23 18:09:22'),(19,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-07-23 22:53:34'),(20,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-07-25 21:44:54'),(21,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-08-02 23:54:04'),(22,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-08-06 20:55:51'),(23,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-08-09 16:38:25'),(24,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-08-09 19:22:55'),(25,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-08-09 19:23:05'),(26,1,1,12.00,0.20,0.25,'','error','Invalid account PIN','2012-08-10 17:41:51'),(27,1,1,12.00,0.20,0.25,'','error','Insufficient funds.','2012-12-04 00:42:54');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-01-11 13:03:48
