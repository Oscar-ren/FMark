/*
Navicat MySQL Data Transfer

Source Server         : 公有云H5
Source Server Version : 50619
Source Host           : 10.120.253.177:3474
Source Database       : duanyuwen

Target Server Type    : MYSQL
Target Server Version : 50619
File Encoding         : 65001

Date: 2016-11-19 16:39:01
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for mark_comment
-- ----------------------------
DROP TABLE IF EXISTS `mark_comment`;
CREATE TABLE `mark_comment` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(1) NOT NULL COMMENT '1-underline,2-mark',
  `cookie` varchar(255) NOT NULL COMMENT '1-yes,2-no',
  `article_content` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `host` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `key` varchar(20) DEFAULT NULL,
  `createtime` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for mark_discuss
-- ----------------------------
DROP TABLE IF EXISTS `mark_discuss`;
CREATE TABLE `mark_discuss` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(15) DEFAULT NULL,
  `comment_id` int(20) NOT NULL,
  `to_id` int(11) DEFAULT NULL,
  `discuss_content` varchar(255) DEFAULT NULL,
  `thumbs` int(10) unsigned NOT NULL DEFAULT '0',
  `createtime` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for mark_user
-- ----------------------------
DROP TABLE IF EXISTS `mark_user`;
CREATE TABLE `mark_user` (
  `user_id` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for mark_website
-- ----------------------------
DROP TABLE IF EXISTS `mark_website`;
CREATE TABLE `mark_website` (
  `user_id` varchar(255) NOT NULL,
  `host` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`host`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
