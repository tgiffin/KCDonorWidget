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
  `mailling_zip` varchar(10) DEFAULT NULL,
  `dwolla_id` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `dob` varchar(20) DEFAULT NULL,
  `ein` varchar(20) DEFAULT NULL,
  `board_type` varchar(200) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity`
--

LOCK TABLES `charity` WRITE;
/*!40000 ALTER TABLE `charity` DISABLE KEYS */;
INSERT INTO `charity` VALUES (1,'Test Charity','111 Test Address Rd',NULL,'Grapevine','TX','76051',NULL,NULL,NULL,NULL,NULL,'812-708-2911',NULL,NULL,NULL,NULL,NULL,'localhost',NULL,NULL,NULL,'2012-07-13 18:20:30'),(2,'asdf','asdf','','asdf','as','76051',NULL,NULL,NULL,NULL,NULL,'812-621-2558','asdf','asdf',NULL,'asdfasdfa@asdf.com','111-111-1111',NULL,NULL,NULL,NULL,'2012-08-03 16:15:16'),(3,'asdf','asdf','','asdf','as','76051',NULL,NULL,NULL,NULL,NULL,'812-562-3958','asdf','asdf',NULL,'asdfasdfaaa@asdf.com','111-111-1111',NULL,NULL,NULL,NULL,'2012-08-03 16:24:10'),(4,'Test Name','Some test dr','','asdf','tx','76051',NULL,NULL,NULL,NULL,NULL,'812-662-0306','Some','Test',NULL,'asdfaa@asdf.com','123-123-1234',NULL,NULL,NULL,NULL,'2012-08-03 16:25:37'),(5,'asf','asdf','','asdf','as','12345',NULL,NULL,NULL,NULL,NULL,NULL,'asdf','asf',NULL,'asf','asdf',NULL,'asdf','asdf',NULL,'2012-08-10 15:47:34'),(6,'asf','asdf','','asdf','as','12345',NULL,NULL,NULL,NULL,NULL,NULL,'asdf','asf',NULL,'asf','asdf',NULL,'asdf','asdf',NULL,'2012-08-10 15:47:44'),(7,'asdf','asdf','','asdf','as','12344',NULL,NULL,NULL,NULL,NULL,'111-111','asdf','asdf',NULL,'asdf','asdf','test.com','asdf','asdf',NULL,'2012-08-10 16:24:40'),(8,'Test Charity','123 Test Drive','','Grapevine','TX','76051',NULL,NULL,NULL,NULL,NULL,'111-1111','test','test',NULL,'test@test.com','111-111-1111','app.klearchoice.com','02/02/1970','111-111-1111',NULL,'2012-08-10 17:46:47');
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

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-01-10 20:19:24
