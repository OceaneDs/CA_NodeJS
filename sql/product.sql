CREATE TABLE IF NOT EXISTS `Product` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50),
  `active` int(1),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=242 ;

INSERT INTO `Product`(`id`, `name`) VALUES
(1, 'Pate'),
(2,'Riz'),
(3,'SauceTomate'),
(4,'GelDouche');
