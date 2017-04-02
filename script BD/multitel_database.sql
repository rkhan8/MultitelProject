create database Multitel;

use Multitel;

drop table Signals;
drop table SignalValue;


/*tables for multitel project */
create table Signals
(
	idN varchar(30) NOT NULL,
	Category varchar(50) NOT NULL,
	MinVal int NOT NULL,
	MaxVal int NOT NULL,
	Unity varchar(10),
	primary key (idN)
);


create table SignalValue
(
		idN varchar(30) NOT NULL,
    ValueRec decimal(5, 2) NOT NULL,
    DateRec date,
    foreign key (idN) references Signals(idN)
);


/*insert Signals exemple*/
insert into Signals (idN, Category, MinVal, MAxVal, Unity) values ('Signal_1', 'Analogique', 9, 15, 'J');
insert into Signals (idN, Category, MinVal, MAxVal, Unity) values ('Signal_2', 'Binaire', 0, 1, 'Binary');
insert into Signals (idN, Category, MinVal, MAxVal, Unity) values ('Signal_3', 'Aléatoire', 19, 65, 'mV');

/*insert SignalValues exemple*/
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.22, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.42, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.82, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.32, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.12, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 12.02, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.72, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.32, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.52, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.92, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.22, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.32, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.42, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 13.12, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 14.82, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.02, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.32, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 13.12, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 13.52, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 14.98, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 14.99, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 12.15, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.01, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.34, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 12.22, '2017-03-09');

insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.42, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.82, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.12, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 12.02, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.72, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 13.52, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 13.92, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 12.22, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 12.42, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.12, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.82, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.02, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 10.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.12, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.52, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 9.98, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 11.99, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 12.15, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 14.01, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 12.34, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_1', 13.22, '2017-03-10');


insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-09');

insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 1, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_2', 0, '2017-03-10');


insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 19.22, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 29.42, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 30.82, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 30.32, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 41.12, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 42.02, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 29.72, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 30.32, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 29.52, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 30.92, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 36.22, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 37.32, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 41.42, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 53.12, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 54.82, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 60.02, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 57.32, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 43.12, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 33.52, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 44.98, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 44.99, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 52.15, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 56.01, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 60.34, '2017-03-09');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 62.22, '2017-03-09');

insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 30.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 20.42, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 21.82, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 21.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 21.12, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 32.02, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 37.72, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 40.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 43.52, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 43.92, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 42.22, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 48.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 52.42, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 51.12, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 49.82, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 49.02, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 42.32, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 41.12, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 39.52, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 32.98, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 31.99, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 27.15, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 24.01, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 22.34, '2017-03-10');
insert into SignalValue (idN, ValueRec, DateRec) values ('Signal_3', 36.22, '2017-03-10');
