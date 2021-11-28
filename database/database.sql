/*psql \! chcp 1251*/
CREATE TABLE IF NOT EXISTS posts(
    idPost SERIAL PRIMARY KEY,
    namePost VARCHAR(100) NOT NULL
);

/*offices*/
CREATE TABLE IF NOT EXISTS  offices(
    idOffice SERIAL PRIMARY KEY,
    nameOffice VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
    idUser serial primary key,
    login varchar(25) not null,
    password varchar(20) not null
);

CREATE TABLE IF NOT EXISTS  professors(
    idProfessor serial primary key, 
    lastName varchar(150) not null,
    firstName varchar(150) not null,
    thirdName varchar(150) not null,
    dateBirht date,
    status smallint not null check (status in (0, 1)),
    job smallint not null check (status in (0, 1, 2)),
    rank smallint not null check (status in (0, 1, 2)),
    degree smallint not null check (status in (0, 1, 2)),
    idPost bigint not null,
    idOffice bigint not null,
    idUser bigint not null,
    idRole bigint not null,

    FOREIGN KEY(idPost) REFERENCES posts(idPost) ON DELETE CASCADE,
    FOREIGN KEY(idOffice) REFERENCES offices(idOffice) ON DELETE CASCADE,
    FOREIGN KEY(idUser) REFERENCES users(idUser) ON DELETE CASCADE-- TODO НЕПОНЯТНАЯ таблчка "roles" на которую ссылаешься строкой ниже,
    -- FOREIGN key(idRole) REFERENCES roles(idRole) ON DELETE CASCADE
);

create table if not exists userRoles (
    idRole serial primary key, 
    nameRole varchar(100) not null
);
