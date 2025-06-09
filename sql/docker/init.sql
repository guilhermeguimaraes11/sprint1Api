-- docker-compose up --build
-- mysql -u root -p

-- docker exec -it c32b7034f1f1cb9d09ec8c8b9783a0b0160b4c841333af716fdece267af28b81 mysql -u root -p


-- CREATE DATABASE reserva_senai;
-- USE reserva_senai;

CREATE TABLE usuario(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nomecompleto VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf CHAR(11) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE sala (
    id_sala INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL,
    descricao TEXT NOT NULL,
    bloco VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    capacidade INT NOT NULL
);

CREATE TABLE reserva_sala (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    fk_id_sala INT NOT NULL,
    fk_id_usuario INT NOT NULL,
    FOREIGN KEY (fk_id_sala) REFERENCES sala(id_sala),
    FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id_usuario)
);

-- Inserindo usuários
INSERT INTO usuario (cpf, nomecompleto, email, senha) VALUES
('12345678901', 'João Silva', 'joao.silva@example.com', 'senha123'),
('23456789012', 'Maria Oliveira', 'maria.oliveira@example.com', 'senha123'),
('34567890123', 'Carlos Pereira', 'carlos.pereira@example.com', 'senha123'),
('45678901234', 'Ana Souza', 'ana.souza@example.com', 'senha123'),
('56789012345', 'Pedro Costa', 'pedro.costa@example.com', 'senha123'),
('67890123456', 'Laura Lima', 'laura.lima@example.com', 'senha123'),
('78901234567', 'Lucas Alves', 'lucas.alves@example.com', 'senha123'),
('89012345678', 'Fernanda Rocha', 'fernanda.rocha@example.com', 'senha123'),
('90123456789', 'Rafael Martins', 'rafael.martins@example.com', 'senha123'),
('01234567890', 'Juliana Nunes', 'juliana.nunes@example.com', 'senha123'),
('12345678902', 'Paulo Araujo', 'paulo.araujo@example.com', 'senha123'),
('23456789013', 'Beatriz Melo', 'beatriz.melo@example.com', 'senha123'),
('34567890124', 'Renato Dias', 'renato.dias@example.com', 'senha123'),
('45678901235', 'Camila Ribeiro', 'camila.ribeiro@example.com', 'senha123'),
('56789012346', 'Thiago Teixeira', 'thiago.teixeira@example.com', 'senha123'),
('67890123457', 'Patrícia Fernandes', 'patricia.fernandes@example.com', 'senha123'),
('78901234568', 'Rodrigo Gomes', 'rodrigo.gomes@example.com', 'senha123'),
('89012345679', 'Mariana Batista', 'mariana.batista@example.com', 'senha123'),
('90123456780', 'Fábio Freitas', 'fabio.freitas@example.com', 'senha123'),
('01234567891', 'Isabela Cardoso', 'isabela.cardoso@example.com', 'senha123');


-- Inserindo salas
INSERT INTO sala (nome, descricao, bloco, tipo, capacidade) VALUES
('Sala de Reuniões 1', 'Sala de reuniões equipada para conferências', 'A', 'Sala', 20),
('Laboratório de Informática', 'Laboratório com computadores e softwares de desenvolvimento', 'B', 'Laboratório', 30),
('Oficina Mecânica', 'Oficina com ferramentas para manutenção de veículos', 'C', 'Oficina', 25),
('Laboratório de Química', 'Laboratório de experimentos químicos', 'D', 'Laboratório', 15),
('Sala de Aula 101', 'Sala de aula equipada com projetor e quadro branco', 'E', 'Sala', 40),
('Auditório Principal', 'Auditório para eventos e palestras', 'F', 'Sala', 100),
('Sala de Estudos', 'Espaço silencioso para estudos individuais', 'G', 'Sala', 12),
('Laboratório de Física', 'Laboratório para experimentos de física', 'H', 'Laboratório', 18),
('Oficina de Marcenaria', 'Oficina equipada com ferramentas de marcenaria', 'I', 'Oficina', 20),
('Sala de Videoconferências', 'Sala equipada para videoconferências e apresentações remotas', 'J', 'Sala', 10),
('Sala de Treinamento', 'Sala de treinamento para cursos corporativos', 'K', 'Sala', 25),
('Laboratório de Biologia', 'Laboratório para experimentos biológicos', 'L', 'Laboratório', 16),
('Sala de Projetos', 'Sala equipada para reuniões de equipe e desenvolvimento de projetos', 'M', 'Sala', 18),
('Sala Multimídia', 'Sala equipada com recursos audiovisuais e multimídia', 'N', 'Sala', 35),
('Oficina de Costura', 'Oficina com máquinas e ferramentas para costura', 'O', 'Oficina', 15),
('Laboratório de Eletrônica', 'Laboratório para experimentos e montagem de circuitos eletrônicos', 'P', 'Laboratório', 20),
('Sala VIP', 'Sala exclusiva para reuniões de alto nível', 'Q', 'Sala', 8),
('Oficina de Soldagem', 'Oficina equipada com maquinário para soldagem', 'R', 'Oficina', 12),
('Laboratório de Culinária', 'Laboratório com equipamentos para aulas práticas de culinária', 'S', 'Laboratório', 12);

-- Inserindo reservas
INSERT INTO reserva_sala (data, horario_inicio, horario_fim, fk_id_sala, fk_id_usuario) VALUES
('2024-11-13', '09:00:00', '12:00:00', 1, 1),
('2024-11-13', '14:00:00', '18:00:00', 2, 2),
('2024-11-13', '08:00:00', '12:00:00', 3, 3),
('2024-11-13', '13:00:00', '17:00:00', 4, 4),
('2024-11-13', '09:00:00', '13:00:00', 5, 5);

    DELIMITER //

    CREATE TRIGGER reserva_antecedencia
    BEFORE INSERT ON reserva_sala
    FOR EACH ROW
    BEGIN
        DECLARE data_hora_reserva DATETIME;
        DECLARE data_hora_atual DATETIME;

        SET data_hora_reserva = CONCAT(NEW.data, ' ', NEW.horario_inicio);
        SET data_hora_atual = NOW();

        IF TIMESTAMPDIFF(MINUTE, data_hora_atual, data_hora_reserva) < 60 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A reserva deve ser feita com no mínimo 1 hora de antecedência.';
        END IF;
    END //

    DELIMITER ;


    DELIMITER //

CREATE PROCEDURE listar_reservas_por_usuario(p_usuario INT)
BEGIN
    SELECT id_reserva, horario_inicio, horario_fim, data
    FROM reserva_sala
    WHERE fk_id_usuario = p_usuario
    ORDER BY data, horario_inicio;
END //

DELIMITER ;


DELIMITER $$

CREATE FUNCTION IF NOT EXISTS total_reservas_por_sala(idSala INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total INT;

    SELECT COUNT(*) INTO total
    FROM reserva_sala 
    WHERE fk_id_sala = idSala; 

    RETURN total;
END$$

DELIMITER ;



    