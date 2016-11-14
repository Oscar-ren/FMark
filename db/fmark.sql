/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50626
Source Host           : 127.0.0.1:3306
Source Database       : fmark

Target Server Type    : MYSQL
Target Server Version : 50626
File Encoding         : 65001

Date: 2016-11-14 10:04:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for mark_coment
-- ----------------------------
DROP TABLE IF EXISTS `mark_coment`;
CREATE TABLE `mark_coment` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `ct_id` int(20) NOT NULL,
  `to_id` int(11) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for mark_ct
-- ----------------------------
DROP TABLE IF EXISTS `mark_ct`;
CREATE TABLE `mark_ct` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `article_content` varchar(255) DEFAULT NULL,
  `mark_content` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `key` varchar(20) DEFAULT NULL,
  `createtime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for mark_user
-- ----------------------------
DROP TABLE IF EXISTS `mark_user`;
CREATE TABLE `mark_user` (
  `id` int(11) NOT NULL,
  `openid` int(11) DEFAULT NULL,
  `keys` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
