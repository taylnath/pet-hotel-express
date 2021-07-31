drop table if exists `test`;
create table if not exists `test` (
  `id` int not null auto_increment,
  `name` varchar(255) not null,
  `language` varchar(255) not null,
  primary key (`id`),
  unique key name (`name`)
);

insert into `test` (`name`, `language`) values ('Bonjour', 'French');
insert into `test` (`name`, `language`) values ('Hello', 'English');
insert into `test` (`name`, `language`) values ('Hej', 'Swedish');

select * from `test`;