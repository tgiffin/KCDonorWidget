CREATE DATABASE  IF NOT EXISTS `klearchoice` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `klearchoice`;
-- MySQL dump 10.13  Distrib 5.5.16, for Win32 (x86)
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
-- Table structure for table `donor`
--

DROP TABLE IF EXISTS `donor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `donor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(512) DEFAULT NULL,
  `password_recovery_token` varchar(200) DEFAULT NULL,
  `password_recovery_date` datetime DEFAULT NULL,
  `salt` varchar(512) DEFAULT NULL,
  `member` bit(1) NOT NULL DEFAULT b'0',
  `city` varchar(200) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `processor_id` varchar(45) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor`
--

LOCK TABLES `donor` WRITE;
/*!40000 ALTER TABLE `donor` DISABLE KEYS */;
INSERT INTO `donor` VALUES (31,'Travis','Giffin','claytongulick@gmail.com','OVB/tH+rtnmYITmznhg3Me9PxK68kvObVmxqnyiI1c7q1SxT6pGxCEQUzwsmLPWX3H6Z1LFf6qeTRXnJ9ZtaT8UYEgA3R6s8YrhnWJ6jJbblb0QocNiAoI6mdKsl2bJ0fzQvMuo1VA5ykB2hWvq2cU7XmJDlhHvmdqBnqBu3hCUue3/J9JLC+tEYQOgTYjhjPZnkpW5BovfWmvQ40US2f+ST7cCZluAehbn4uWUDETRuAgPA0Oatjs/nE+Sxci9NpB9Acr1ta5xAeHhsV7Gd6q2L6OtV9SrF7N569vjgJKfi/geDvnGzbwNpRLbhztIzUpg2p83GoSwMSIpWdp5noA==','',NULL,'w4hJ2MENf2r3zKTE/hpiyYRB6WJJHAFHhnYSk+lwb4JXL+xeUlijra1HG7vblVlECKhPQOprJEhKK34gBLIZ/UkWGMIJTH1OgyJY+7KA5TWWcvf7D0VMDR3sN5d/Ku+gSHdT3w7NZYbEX9kluMtSuZZoS04AYygJEj79KPWioqM=','',NULL,NULL,NULL,'2013-04-14 20:34:39'),(32,'clay2','Gulick','claytongulick@gmail.com','NOwKn4z2D3Ro/5im1N1H8A/PVQYIjPJtsmBSlcilJ+GcvYakhbp+zVbbPR9NXcxPeTxEmlsks725BhnswE54NYNMiV/IBZPYy+Dyl1YL8TilREWjz2LvktZmmHWRKMj2upVg5eEeyU7IedB5IZegSO2/XCiRUQng+8CF98N39dPsvV945G/8MHqg+jUp1TnuQI52fQAQrKourMv/S5g5kQ/1CfEBZIqclJdn6QheVHvILmPN1mVgLKVgwdZDjSxOyYLlNpTsxL4WKDXTxWpMKXhVlW0m9B24vabGRumL54Qsel/ba5F5kjckj11K91XY6xhbp1wxsgQPH/KLsHH5yg==',NULL,NULL,'COznQ6UuSBOlCYe86JvG2otE2H/Ht/qhssvrTuJw7ZM9mHBbfMqWJnLXFLUTwndWoIjrojjdxyfc9ROZxjzbmPyYp2ONhe9Ehef6K3mJEErRlEcuqKVeXeBAVIlzbTv0y1CKRoWzRgMV8ok8bxKFO0l1RMuYFiPu00Bqrqqz69E=','',NULL,NULL,NULL,'2013-04-30 05:56:09'),(33,'Clay','Gulick','claytongulick@gmail.com','X3rh++Fc5N0Ie1ZF/KdVliWlTw6IlMp2K2l/vcsr6CRaJkwWvG+iEbgsehMYsbVEL6l2K6UGycW9AtHcOHfE+9L68s+q0D5lzYcdPImjQhIJ2dteMs3BCFuCkrCPXSeKClRpDAer+bpl2rFs9KFMfQ11vliTdgoGGcv157ewzSqsNoP7kPBwTj4V6Aef5QmGzb8mDvGpQ0RTV+AZkipsmSKydDY/R5dcxZK05kn5U+jKI6KANS2RSs238frli5UKBlYMObLyeLjZLeyJTmFyky5g9DfqbLVH8NlSbQpaC0fZLw1zS+/tupu28Sm8S9u96O2TE4EjkWGG2f2/qI26GQ==',NULL,NULL,'xo9DrhwUVVXoGeAftrfYTRlCWiDWDX1cTfIT0oKpzsDGje8itZNvD+vCtoWN2QuqdHqgf2kleR38JZWhhwX+al/kBJ7sIwoFtKKbakgI4VMzhb35YjO/UTtk2a8oqroVVyc/BaiM41Cl5H9NF+bvRgxBKgtLhQRUAu3+VkrdS3Q=','',NULL,NULL,NULL,'2013-04-30 23:10:47'),(34,'clay','gulick','claytongulick@gmail.com','//FDX3lhdP26jDTgrzlo6j/qDmUTQiMTTNEq26Eq0dGwmDFs56Drn8zoqrxSu898VRdDxVk6zZ7G7RfQY1/z3rQxHdknXgRtDC9HLMOwJaTShZqj3KCnYTH1NRWLsunw7G4xJJ9vILmrkPsHKFrKlG9FRoV74pE4cDxoWrUVhO+3eUODKfp4SXJuX9EwzLpPHNFk3ZiG8ENql+DSb/WOEpoGWfsCzDySlXqE1YRlL7oZSBdWIUuBLneO/d34u9S0r17ciKu0TVvsXaYy4GFHkBuBv23WlUGNn9GxF0AckYFQFET9tCzgf4kcSlY2JqbsSd2DGQ/qwP5N07R7IOC0Jw==',NULL,NULL,'dsqweurMZ2J9rWseRRiD1S+ddhQmuWVTk0LzJUjhsXURxcPr0Cm46/swHfeqK99Aqj7uyhlJPFqto0/5o4fLCvGGHbAzOjXNsEzb88qEPanR1Rp5QxknUycOssaTt808rYXzESl40iIWX1YuQjjDGvc/1hZ4+NvtO6sIyexeBg0=','',NULL,NULL,NULL,'2013-05-03 23:36:37'),(35,'Clay','Gulick','claytongulick@gmail.com','WQz0R0IM16VcZ5f8WeLzilbAUYIKD5B5aMhgvaN144OqmQ5YS1tPtGCIoyu5jLfzHEjq6H5MDaD2tCaVzZ7ttwRhJgH/JxztpLX7r6J7sgWbz8dzRr9G2wzDNy/zEuUiBqzyUswOkRaYdR2AmyRK/E7xdCAXT3AQWHNUnGAf0P+QvsAMDbmCDGSAU2z7LuGMag39Tz5pWdCyUJ4jvczq3sfzT799BcFnr4a4rxdHVX7ErY5k7V1D/ydxaXZOhFGjRRcKlvI0PylI7tdDLlwPwapC7jnnYtGPL3YS0YD9CWGT1Zv/Ava6fcdevo4uSVnJ4tpmrWTDjC6WYZKkmd/kLw==',NULL,NULL,'oyLI3SaTermYDIJtzcoHLfZIf+85GEY6HK0Rf4gNn2lJ98Juk9zmajH7MN2ImgHvFl5l5HIYZys4XkM9CDLdsviQZrqHODbaRwodnlZRNnOHFKZQC3pLMSK+0vMPh6jZ4XNxhr42sdai6oOVluueplcwup5H3iTR7+O1SuNMfA8=','',NULL,NULL,NULL,'2013-05-03 23:39:11'),(36,'Clayton','Gulick','claytongulick@gmail.com','3RbAhr6GpZNI1E0ZYdsE1q8xcdA7obFYeCQkLGeyjmapNwgu0F8DrmqV3T2vP5WwHtmNuFUxdk6sNMrFiLCdVtyT24pgwcMxtLKgHyaI2IxlFM6ktAlgM9mWWAliD2ecqiWLHJmD3B+jt0i5ElguiUraho3QerzNUUftmYBg5P+3UW3QhsLiSUrZzt5xkV3Rj+F8UYQ4CuGhHrV56ZuuNujCYFZrPa7sTERx43jyoIX6Rk2+8iWAB94rOtpgbG9rzUrMHmAn+rtXYs+tmPmrbUqzpoG5wFD2tzYoNaiBuLCDEXMU2GuCUeh+l6jkPrZXlMiDL7T3+0NMBsziY34puA==',NULL,NULL,'2Qe9HJp1YUsFFhRgJ+10WLRxgxkaQWtJT/SOMbV2RKt9HQaZhdazTRXiYbHS36nc826OHRQ693sKj4cbQrW66fRGyzJOuwqa017q2CNdUPWrf1BlYKN4U1FEn5cw0cnhDrg6gt5Rf7fuo1StZ20UpVgK5aWejBAQB02YzGmWXQo=','',NULL,NULL,NULL,'2013-05-03 23:41:57'),(37,'clayton','gulick','claytongulick@gmail.com','tCI5TrB0FhhcpZ4PmEF8adeEEfn83YmR1EtQatC5kWon7nbJZ9PTzCFs6anmgg16FNGlfJxlWslkMsCpvmnZ3Ay0OI6JZqWNPA1UkKVUt9UUMqy3xSUoZuu0YYFBDRtuXXr83p4Si+eURfebbOemrEqo9oCOYeiHalM+jgqUGvbTO9xJZr81hpXOxVmZjmk10yNyys8kBXYVA2v5kJJ/Jqa1gPfj/JD0F02+hsGhnsqsvuan8Ji+Bnx7MncDLU5KMDwfzQDmdA3tI3wsguT9AD4J2hw72jDKNcK6fjhgtfX8IF+8x8pB+xWH/mUUEPW3dR0XVwyFXgjl9Lx0rZuhEA==',NULL,NULL,'cETnzJmXssoSYtsZGJRanucq/okrAwviYV+9FuObvNhJihNtnGRIuA+Fg6f5Dpf3W2MyXEsKS7sndmAucu/Jk1u4oYQhFk6v8tnfXXYLgltuclNCrxAEtjn5Qv5wkqNDZOnRztaPaah2nLKTYr17BI9j1Tu1UckFtH1jS2QGTQc=','',NULL,NULL,NULL,'2013-05-03 23:47:46'),(38,'asdf','asdf','asdf@asdf.com','7gakCPCAyjHAWtGSU1C2O8pDcwgWN5m4IWh2P0/XVwL+yqzoC4GnPbl6ZSEpqXsKsY4IhZ9jxHzJRj0Sp02EvaTj+ZOVul3V4CqXT8+ByQ1UMoZ38b5RlbETn+QzNezcjOZdG7JrKfSYJsqfMoU3YXvggNBL9LsIhc3mHfse9Mq4b+11KOxihDOGZRl7Cw2doyrfoz/cqtWal6//t6lubXB10e3+EHhjBCnMQYjkTn0t9HM0KN9x/ESmrRWOxnxRwq1wbJJLwfCeK1dMFTCA3z+C3JselHZv6t97WiZ+u36lXBSOSAqrO8TFzpAvzNdD/hLwpKAtTF4c3cHFFgesqA==',NULL,NULL,'1eoaKvJs5lblYh8uAkASQ00pA1jq6H6YCvA5To81UAClzv4gcxi92OxUa1I6zYDx7s+hlCU3vtp2OSr91JHx0UP2kGt5MVdJz7L8H/Cg8uIRIqs//w2GUMxdRUM08vrIBVakLmECl6+7A64DV7jYtgzvv78UiuTkzJ+spaAEKbE=','',NULL,NULL,NULL,'2013-05-03 23:48:49'),(39,'clay','gulick','claytongulick@gmail.com','OWl4mtzNHMvTjx9LlbVa1n1R40qHlsnKPQoXVzDxHGeocptCxx0RwcBL9mmoxdISqqXbx6JF1f5khTOd9FeLXlUQVjWi/RrN0hewdpCZ8p2izmp/CBFxdFxbE1gkVd5oEEfDABWQdxwJxCcmNf9BEfo13U0Ne9j8nYDgm+Tv9QuHxH9x3qNZI96YC374/XgG4cV3a4xlCDkpZWDjsMEGbtHw2x8V8aRRjPCwfnd/Z7s4fwag2M4Rf9/zvLRY/mRfeyOCUsN0w+S9GRM25nlmahVT+H29DQNtx7pPlRGOzyuZKGfEth8QaJLIQ471OBVhGB4FvjNwga6QKeTs+Iy2Mw==',NULL,NULL,'Az88Qg7bX/K7vQdFWSH9D4R9fqjqg0YLb6opfPa9YEh+CjcYzlp6Y1J0kfIo7prORS6TcfXrdJD8KD3d8FdtfU1wNbLPgxaZjfyOWEukBUdPGO6KEGz4yPL9g6RCB9eqlIzbYokW6JJOnfm+gcx2ogC2Fm4S/cIbd/Q+TwNFgwQ=','',NULL,NULL,NULL,'2013-05-03 23:57:57'),(40,'clay','gulick','claytongulick@gmail.com','c/PMepzkfsXlV75HZIETbTxKhgByLkBz3dfBw2RA4W8DgRp1zhzt82xUDV2RWYuKofhh/l2ll5SwFcD8UhrjWBAo6/9VNVpyECjjdUVeJX9+0qfrlhuJtMT9+tTOoFiZdV2qdlekDpY7WodHOeWzxmznjbsrBrmHT4BRfGaKnKY7N1T0ILhxiKwMLRuz8QsvXUQ/I+x3dhuZvzbGGuz9YQYEqOiit/jUugbrCtCy8YjIr1NIfi/KvtblP7Or2TrYxwI8zdctlcXd0B9Ic5bOvE009xLFB+/b/JBvAUCjHsK1XxmofIQ1swvk0LSxTJSUd0ucIa9vC4tONCwkh/yXAw==',NULL,NULL,'MnkJbwh581bigLAdLWl1uL9BS3lbjjXN2gl+KeV4kCQ9khc/yDhokK880fYyspNp1dSZMHn4nT6BlVZ/4g2jDwNuEbd72ysAdMwnF0TP3Ajcm6OrbR+Kdzfwfcfw8kkNUmyLgMDAMZq7aGHnVURxTukv+M/nfLqfPK/VzhnVkgI=','',NULL,NULL,NULL,'2013-05-04 00:04:20'),(41,'clay','gulick','asdf@asdf.com','CbcnkIDNRNJQ4scLJNOhth/fBgR42Af2gZ6Xsh/83r1p+0OgxuPi1duce7ddN3RCs3q9nJ45RGaohZqwV6/Uojygre8OLfD7Vdyqknf+1xGqEGurOk3IQABnxPZVs82LneGNFGw6+WrvfnMCuX8Rr21X38mLkhHnyasRdJeh2ABTx8VrOiKv5oKQjtOQn/HgCn7xcKuEeC711rq+iEzBfQ3cilSMZ9oaTyJHw2vwc68+OgIkqxSK2pKNLtRy4G19Chl4LlX+2gtQFNCnVjuRtcglD4fU4vMiV+yM7/5r3e90UySE74p9u0xyDsM0hdZoFflIHq45wRNwWjKJpnl1Fw==',NULL,NULL,'PV7mBIhsXF7YX9IYc/w+QbQk/aDbcQh3gNetjiMlmOOU4h5c0xYbrJ4w6K1PmQw1OfnEZbNBI5RvgxTFsYIUP4Woe7L52SR0l1LjuyNeH7TJfAcRvs0KnZCbFfIVE/lZRanN4CTvBeOgQ/eJUueZSed4BVf3G5YP5jUAITMuFPA=','',NULL,NULL,NULL,'2013-05-04 00:06:51'),(42,'asdf','asdf','asdf@asdf.com',NULL,NULL,NULL,NULL,'\0',NULL,NULL,NULL,'2013-05-04 00:19:51'),(43,'Clay','Gulick','claytongulick@gmail.com',NULL,NULL,NULL,NULL,'\0',NULL,NULL,NULL,'2013-05-08 01:32:25');
/*!40000 ALTER TABLE `donor` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity`
--

LOCK TABLES `charity` WRITE;
/*!40000 ALTER TABLE `charity` DISABLE KEYS */;
INSERT INTO `charity` VALUES (1,'Test Charity','111 Test Address Rd',NULL,'Grapevine','TX','76051',NULL,NULL,NULL,NULL,NULL,'812-708-2911',NULL,NULL,NULL,NULL,NULL,NULL,'localhost',NULL,NULL,NULL,'2012-07-13 18:20:30'),(20,'Test Church','123 Test Addr','','Grapevine','tx','76051','','','','','','812-708-2911','Clay','Gulick','Test Title','M','claytongulick@gmail.com','(302) 383-0000','dev.klearchoice.com','01/01/1970','','Deacons','2013-03-11 17:57:02'),(21,'Test App Church','1234 Test Ave',NULL,'Grapevine','TX','76051',NULL,NULL,NULL,NULL,NULL,'812-708-2911','Clay','Gulick','Test Title','M','claytongulick@gmail.com','(302) 383-0000','app.klearchioce.com','01/01/1970','1234','Deacons','2013-03-21 17:13:56'),(22,'asdf','asdf','','asdf','rx','12345','','','','','','1234-1234','asdf','asdf','asdf',NULL,'sadf@sadf.com','(302) 302-3021','asdf.com','10/10/1234','','asdf','2013-04-30 21:59:19'),(23,'Church of Clay','2023 Hood Ridge Ct','','Grapevine','TX','76051','','','','','','123-123','Clay','Gulick','Test',NULL,'claytongulick@gmail.com','(302) 302-3023','test.com','08/01/1901','','Elder','2013-05-07 21:55:55'),(24,'Church of Clay','2023 Hood Ridge Ct','','Grapevine','tx','76051','','','','','','1234-1234','Clay','Gulick','Test Title',NULL,'claytongulick@gmail.com','(302) 302-3023','test.com','08/01/1803','','Elder','2013-05-07 21:58:12'),(25,'Clay&#039;s Church Of Gulick','2023 Hood Ridge Ct','','Grapevine','TX','76051','','','','','','123-123','Clay','Gulick','Test Title 2',NULL,'claytongulick@gmail.com','(302) 383-3838','somewhere.com','03/17/1876','','Elder','2013-05-08 00:32:06');
/*!40000 ALTER TABLE `charity` ENABLE KEYS */;
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
  `processor_transaction_id` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'new',
  `batch_id` int(11) DEFAULT NULL,
  `batch_date` datetime DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `log` text,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `batch_id` (`batch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (47,31,20,1.00,0.20,0.25,NULL,'processed',NULL,NULL,'Successfully posted transaction','Sun Apr 14 2013 15:34:42 GMT-0500 (CDT)Successfully posted transaction','2013-04-14 20:34:39'),(48,31,20,1.10,0.20,0.25,'2634895','posted',1,'2013-04-14 15:38:10','Sun Apr 14 2013 15:43:59 GMT-0500 (CDT)posted to dwolla','Sun Apr 14 2013 15:35:33 GMT-0500 (CDT)Transaction created \nSun Apr 14 2013 15:38:18 GMT-0500 (CDT)Account number must be between 3-17 digits long. Please check your account number and try again.\r\nParameter name: accountNumber\nSun Apr 14 2013 15:43:59 GMT-0500 (CDT)posted to dwolla\n','2013-04-14 20:35:31'),(49,31,20,10.00,0.20,0.25,'2833063','posted',2,'2013-04-30 18:32:48','Thu May 02 2013 14:52:24 GMT-0500 (CDT)posted to dwolla','Tue Apr 30 2013 00:06:56 GMT-0500 (CDT)Transaction created \nTue Apr 30 2013 18:33:29 GMT-0500 (CDT)Error: getaddrinfo EADDRINFO\nThu May 02 2013 14:52:24 GMT-0500 (CDT)posted to dwolla\n','2013-04-30 05:06:57'),(50,31,20,1.00,0.20,0.25,'2833070','posted',2,'2013-04-30 18:32:48','Thu May 02 2013 14:52:25 GMT-0500 (CDT)posted to dwolla','Tue Apr 30 2013 00:54:38 GMT-0500 (CDT)Transaction created \nThu May 02 2013 14:52:25 GMT-0500 (CDT)posted to dwolla\n','2013-04-30 05:54:38'),(51,32,20,1.00,0.20,0.25,NULL,'processed',NULL,NULL,'Successfully posted transaction','Tue Apr 30 2013 00:56:11 GMT-0500 (CDT)Successfully posted transaction','2013-04-30 05:56:11'),(52,33,20,10.00,0.25,0.25,NULL,'processed',NULL,NULL,'Successfully posted transaction','Tue Apr 30 2013 18:10:55 GMT-0500 (CDT)Successfully posted transaction','2013-04-30 23:10:57'),(53,31,20,10.01,0.25,0.25,'2833075','posted',2,'2013-04-30 18:32:48','Thu May 02 2013 14:52:27 GMT-0500 (CDT)posted to dwolla','Tue Apr 30 2013 18:19:45 GMT-0500 (CDT)Transaction created \nThu May 02 2013 14:52:27 GMT-0500 (CDT)posted to dwolla\n','2013-04-30 23:19:47'),(54,34,20,10.00,0.25,0.25,NULL,'processed',NULL,NULL,'Successfully posted transaction','Fri May 03 2013 18:36:53 GMT-0500 (CDT)Successfully posted transaction','2013-05-03 23:36:48'),(55,35,20,10.00,0.25,0.25,NULL,'processed',NULL,NULL,'Successfully posted transaction','Fri May 03 2013 18:39:27 GMT-0500 (CDT)Successfully posted transaction','2013-05-03 23:39:22'),(56,36,20,10.01,0.25,0.25,NULL,'processed',NULL,NULL,'Successfully posted transaction','Fri May 03 2013 18:42:13 GMT-0500 (CDT)Successfully posted transaction','2013-05-03 23:42:08'),(57,38,20,10.00,0.25,0.25,'test_transaction','processed',NULL,NULL,'Successfully posted transaction','Fri May 03 2013 18:49:05 GMT-0500 (CDT)Successfully posted transaction','2013-05-03 23:49:00'),(58,39,20,10.00,0.25,0.25,'test_transaction','processed',NULL,NULL,'Successfully posted transaction','Fri May 03 2013 18:58:13 GMT-0500 (CDT)Successfully posted transaction','2013-05-03 23:58:08'),(59,40,20,10.02,0.25,0.25,'test_transaction','processed',NULL,NULL,'Successfully posted transaction','Fri May 03 2013 19:04:36 GMT-0500 (CDT)Successfully posted transaction','2013-05-04 00:04:30'),(60,41,20,10.03,0.25,0.25,'test_transaction','processed',NULL,NULL,'Successfully posted transaction','Fri May 03 2013 19:07:07 GMT-0500 (CDT)Successfully posted transaction','2013-05-04 00:07:02'),(61,42,20,10.00,0.25,0.25,'test_transaction','processed',NULL,NULL,'Successfully posted transaction','Fri May 03 2013 19:19:56 GMT-0500 (CDT)Successfully posted transaction','2013-05-04 00:19:51'),(62,31,20,10.00,0.25,0.25,'2852051','posted',3,'2013-05-03 19:48:31','Fri May 03 2013 20:02:58 GMT-0500 (CDT)posted to dwolla','Fri May 03 2013 19:47:52 GMT-0500 (CDT)Transaction created \nFri May 03 2013 20:02:58 GMT-0500 (CDT)posted to dwolla\n','2013-05-04 00:47:47'),(63,43,20,10.12,0.25,0.25,'test_transaction','processed',NULL,NULL,'Successfully posted transaction','Tue May 07 2013 20:32:27 GMT-0500 (CDT)Successfully posted transaction','2013-05-08 01:32:25'),(64,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,'Sun May 26 2013 23:10:08 GMT-0500 (CDT) recurring transaction created from subscription: 1','Sun May 26 2013 23:10:08 GMT-0500 (CDT) recurring transaction created from subscription: 1','2013-05-27 04:10:08'),(65,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,'Mon May 27 2013 01:50:07 GMT-0500 (CDT) recurring transaction created from subscription: 1','Mon May 27 2013 01:50:07 GMT-0500 (CDT) recurring transaction created from subscription: 1','2013-05-27 06:50:08'),(66,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,'Mon May 27 2013 01:52:16 GMT-0500 (CDT) recurring transaction created from subscription: 1','Mon May 27 2013 01:52:16 GMT-0500 (CDT) recurring transaction created from subscription: 1','2013-05-27 06:52:16'),(67,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,'Mon May 27 2013 01:53:21 GMT-0500 (CDT) recurring transaction created from subscription: 1','Mon May 27 2013 01:53:21 GMT-0500 (CDT) recurring transaction created from subscription: 1','2013-05-27 06:53:21'),(68,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,'Mon May 27 2013 01:54:50 GMT-0500 (CDT) recurring transaction created from subscription: 1','Mon May 27 2013 01:54:50 GMT-0500 (CDT) recurring transaction created from subscription: 1','2013-05-27 06:54:50'),(69,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 11:19:31 GMT-0500 (CDT)Transaction created \n','2013-05-31 16:19:26'),(70,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 11:26:14 GMT-0500 (CDT)Transaction created \n','2013-05-31 16:26:09'),(71,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 11:56:26 GMT-0500 (CDT)Transaction created \n','2013-05-31 16:56:21'),(72,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 12:00:23 GMT-0500 (CDT)Transaction created \n','2013-05-31 17:00:18'),(73,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 12:02:28 GMT-0500 (CDT)Transaction created \n','2013-05-31 17:02:23'),(74,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 12:03:23 GMT-0500 (CDT)Transaction created \n','2013-05-31 17:03:18'),(75,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 12:04:25 GMT-0500 (CDT)Transaction created \n','2013-05-31 17:04:20'),(76,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 12:08:03 GMT-0500 (CDT)Transaction created \n','2013-05-31 17:07:58'),(77,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 12:09:52 GMT-0500 (CDT)Transaction created \n','2013-05-31 17:09:47'),(78,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 12:12:24 GMT-0500 (CDT)Transaction created \n','2013-05-31 17:12:19'),(79,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 12:58:42 GMT-0500 (CDT)Transaction created \n','2013-05-31 17:58:36'),(80,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:02:10 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:02:05'),(81,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:05:16 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:05:10'),(82,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:07:09 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:07:04'),(83,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:11:00 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:10:55'),(84,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:12:12 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:12:07'),(85,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:13:09 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:13:04'),(86,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:13:39 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:13:34'),(87,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:16:21 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:16:16'),(88,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:17:09 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:17:03'),(89,31,20,1.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 13:59:31 GMT-0500 (CDT)Transaction created \n','2013-05-31 18:59:26'),(90,31,20,2.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 14:00:33 GMT-0500 (CDT)Transaction created \n','2013-05-31 19:00:28'),(91,31,20,2.00,0.25,0.25,NULL,'new',NULL,NULL,NULL,'Fri May 31 2013 14:02:39 GMT-0500 (CDT)Transaction created \n','2013-05-31 19:02:33');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `donor_id` int(11) NOT NULL,
  `charity_id` int(11) NOT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `frequency` varchar(45) NOT NULL,
  `next_transaction_date` date DEFAULT NULL,
  `last_transaction_date` date DEFAULT NULL,
  `cancel_date` datetime DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
INSERT INTO `subscription` VALUES (1,31,20,1.00,'monthly',NULL,NULL,'2013-05-31 13:15:46','2013-06-01 03:45:51'),(2,31,20,1.00,'weekly',NULL,NULL,'2013-05-31 13:15:47','2013-05-31 18:12:09'),(3,31,20,1.00,'weekly',NULL,NULL,'2013-05-31 13:15:48','2013-05-31 18:13:08'),(4,31,20,1.00,'weekly',NULL,NULL,'2013-05-31 13:15:52','2013-05-31 18:13:37'),(5,31,20,1.00,'weekly',NULL,NULL,'2013-05-31 13:22:53','2013-05-31 18:16:20'),(6,31,20,1.00,'weekly',NULL,NULL,'2013-05-31 13:22:56','2013-05-31 18:17:06'),(7,31,20,1.00,'weekly','2013-06-07',NULL,NULL,'2013-05-31 18:59:43'),(8,31,20,2.00,'monthly','2013-06-30',NULL,NULL,'2013-05-31 19:00:35');
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-06-09 18:53:55
