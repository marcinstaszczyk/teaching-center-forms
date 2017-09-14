delete from s_areas;
delete from s_types;
delete from s_owners;
delete from s_index;

INSERT INTO s_areas("group", name) VALUES (true , 'Kursy, warsztaty, konferencje');
INSERT INTO s_areas("group", name) VALUES (false, 'Język polski');
INSERT INTO s_areas("group", name) VALUES (false, 'Języki obce');
INSERT INTO s_areas("group", name) VALUES (false, 'Kształcenie zawodowe');

INSERT INTO s_types(name) VALUES ('seminarium');
INSERT INTO s_types(name) VALUES ('szkolenie');
INSERT INTO s_types(name) VALUES ('konferencja');
INSERT INTO s_types(name) VALUES ('kurs');
INSERT INTO s_types(name) VALUES ('kurs kwalifikacyjny');
INSERT INTO s_types(name) VALUES ('warsztaty');

INSERT INTO s_owners(name) VALUES ('Jan Kowalski');
INSERT INTO s_owners(name) VALUES ('Anna Włodarska');

INSERT INTO s_index(name) VALUES ('Chemia');
INSERT INTO s_index(name) VALUES ('Fizyka');
INSERT INTO s_index(name) VALUES ('Historia');
INSERT INTO s_index(name) VALUES ('Matematyka');

--INSERT INTO cen_user(name, login, password, "errCount") VALUES ('Admin', 'admin','wiyymlGWvu1657g2IWYpMHP9RP178GB++fUxfp4CJ9ha1DREhnXGaI9IMrMExiAbNm6MVyAkzFzCDhI7YKyGug==',0);