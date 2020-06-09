CREATE TABLE IF NOT EXISTS `Type` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(50),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=242 ;

INSERT INTO `Product`(`id`, `token`) VALUES
(1, 'Litre'),
(4,'Kilogramme');
