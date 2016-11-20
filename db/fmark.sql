/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : fmark

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2016-11-19 11:42:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `mark_comment`
-- ----------------------------
DROP TABLE IF EXISTS `mark_comment`;
CREATE TABLE `mark_comment` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(1) NOT NULL COMMENT '1-underline,2-mark',
  `cookie` varchar(255) NOT NULL COMMENT '1-yes,2-no',
  `article_content` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `key` varchar(20) DEFAULT NULL,
  `createtime` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mark_comment
-- ----------------------------
INSERT INTO `mark_comment` VALUES ('26', '2', '1479520229202', '时间的问题是随手选择停留时间长再', '{\"start_index\":7,\"text_length\":16,\"common_tag\":\"SPAN\",\"tag_index\":2,\"right\":360,\"bottom\":226.0625,\"left\":104,\"top\":210.0625}', 'http://localhost:8360/', '测试用例', null, '1479522967357');

-- ----------------------------
-- Table structure for `mark_discuss`
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
-- Records of mark_discuss
-- ----------------------------
INSERT INTO `mark_discuss` VALUES ('3', '游客499', '26', null, 'fawhfio', '0', '1479522967357');

-- ----------------------------
-- Table structure for `mark_user`
-- ----------------------------
DROP TABLE IF EXISTS `mark_user`;
CREATE TABLE `mark_user` (
  `id` int(11) NOT NULL,
  `openid` int(11) DEFAULT NULL,
  `keys` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mark_user
-- ----------------------------
