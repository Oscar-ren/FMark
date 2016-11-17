/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50626
Source Host           : 127.0.0.1:3306
Source Database       : fmark

Target Server Type    : MYSQL
Target Server Version : 50626
File Encoding         : 65001

Date: 2016-11-15 17:43:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for mark_comment
-- ----------------------------
DROP TABLE IF EXISTS `mark_comment`;
CREATE TABLE `mark_comment` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(1) NOT NULL COMMENT '1-underline,2-mark',
  `article_content` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `key` varchar(20) DEFAULT NULL,
  `createtime` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for mark_discuss
-- ----------------------------
DROP TABLE IF EXISTS `mark_discuss`;
CREATE TABLE `mark_discuss` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` int(20) NOT NULL,
  `to_id` int(11) DEFAULT NULL,
  `discuss_content` varchar(255) DEFAULT NULL,
  `thumbs` int(10) unsigned NOT NULL DEFAULT '0',
  `createtime` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

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
