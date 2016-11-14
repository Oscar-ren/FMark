/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50626
Source Host           : 127.0.0.1:3306
Source Database       : fmark

Target Server Type    : MYSQL
Target Server Version : 50626
File Encoding         : 65001

Date: 2016-11-14 12:13:03
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
  `type` int(2) DEFAULT NULL COMMENT '1为underline，2为mark',
  `name` varchar(15) DEFAULT NULL,
  `article_content` varchar(255) DEFAULT NULL,
  `mark_content` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `key` varchar(20) DEFAULT NULL,
  `thumbs` int(11) unsigned NOT NULL DEFAULT '0',
  `createtime` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;

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
