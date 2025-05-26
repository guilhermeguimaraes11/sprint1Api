-- ================================
--  Criação do BCD e Tabelas
-- ================================

-- Permite que usuários sem privilégio SUPER criem funções armazenadas mesmo com o log binário ativado

SET GLOBAL log_bin_trust_function_creators = 1;

CREATE DATABASE rs; 
USE rs;

CREATE TABLE usuario(
     id_usuario INT PRIMARY KEY AUTO_INCREMENT,
     nome VARCHAR(255) NOT NULL, 
     email VARCHAR(255) UNIQUE NOT NULL,
     NIF CHAR(7) UNIQUE NOT NULL,
     senha VARCHAR(255) NOT NULL
);

CREATE TABLE sala(
     id_sala INT PRIMARY KEY AUTO_INCREMENT,
     nome VARCHAR(255) UNIQUE NOT NULL,
     descricao VARCHAR(255) NOT NULL, 
     bloco VARCHAR(1) NOT NULL, 
     tipo VARCHAR(255) NOT NULL,
     capacidade INT NOT NULL
);

CREATE TABLE reserva(
     id_reserva INT PRIMARY KEY AUTO_INCREMENT,
     fk_id_sala INT NOT NULL,
     fk_id_usuario INT NOT NULL,
     dia_semana VARCHAR(20) NOT NULL,
     data DATE NOT NULL,
     hora_inicio TIME NOT NULL,
     hora_fim TIME NOT NULL,
     FOREIGN KEY (fk_id_sala) REFERENCES sala(id_sala),
     FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id_usuario)
);

CREATE INDEX idx_reserva_dia_semana ON reserva(dia_semana);
CREATE INDEX idx_reserva_hora_inicio ON reserva(hora_inicio);
CREATE INDEX idx_reserva_hora_fim ON reserva(hora_fim);

-- ================================
--  Inserção dos Dados
-- ================================

INSERT INTO usuario (nome, email, senha, NIF) VALUES
('João Silva', 'joao.silva@docente.senai.br', 'joao.6789', '3456789'),
('Maria Oliveira', 'maria.oliveira@docente.senai.br', 'maria.4321', '7654321'),
('Carlos Pereira', 'carlos.pereira@docente.senai.br', 'carlos.7456', '3987456'),
('Ana Souza', 'ana.souza@docente.senai.br', 'ana.3789', '6123789'),
('Pedro Costa', 'pedro.costa@docente.senai.br', 'pedro.3456', '9123456'),
('Laura Lima', 'laura.lima@docente.senai.br', 'laura.4987', '1654987'),
('Lucas Alves', 'lucas.alves@docente.senai.br', 'lucas.1987', '4321987'),
('Fernanda Rocha', 'fernanda.rocha@docente.senai.br', 'fernanda.2963', '1852963'),
('Rafael Martins', 'rafael.martins@docente.senai.br', 'rafael.8147', '9258147'),
('Juliana Nunes', 'juliana.nunes@docente.senai.br', 'juliana.7369', '8147369'),
('Paulo Araujo', 'paulo.araujo@docente.senai.br', 'paulo.3486', '9753486'),
('Beatriz Melo', 'beatriz.melo@docente.senai.br', 'beatriz.9753', '6159753'),
('Renato Dias', 'renato.dias@docente.senai.br', 'renato.6159', '3486159'),
('Camila Ribeiro', 'camila.ribeiro@docente.senai.br', 'camila.2741', '3852741'),
('Thiago Teixeira', 'thiago.teixeira@docente.senai.br', 'thiago.1963', '2741963'),
('Patrícia Fernandes', 'patricia.fernandes@docente.senai.br', 'patricia.3852', '1963852'),
('Rodrigo Gomes', 'rodrigo.gomes@docente.senai.br', 'rodrigo.1852', '3741852'),
('Mariana Batista', 'mariana.batista@docente.senai.br', 'mariana.8369', '7258369'),
('Fábio Freitas', 'fabio.freitas@docente.senai.br', 'fabio.7258', '9147258'),
('Isabela Cardoso', 'isabela.cardoso@docente.senai.br', 'isabela.9147', '8369147');

INSERT INTO sala (nome, descricao, bloco, tipo, capacidade) VALUES
('AMA - Automotiva', 'Alta Mogiana Automotiva', 'A', 'Oficina', 16),
('AMS - Desenvolvimento', 'Alta Mogiana Desenvolvimento de Sistema', 'A', 'Sala', 16),
('AME - Eletroeletrônica', 'Alta Mogiana Eletroeletrônica', 'A', 'Laboratório', 16),
('AMM - Manutenção', 'Alta Mogiana Manutenção', 'A', 'Oficina', 16),
('A2 - ELETRÔNICA', 'Laboratório de Eletrônica', 'A', 'Laboratório', 16),
('A3 - CLP', 'Controladores Lógicos Programáveis', 'A', 'Laboratório', 16),
('A4 - AUTOMAÇÃO', 'Sistemas de Automação', 'A', 'Laboratório', 20),
('A5 - METROLOGIA', 'Instrumentos de Medição', 'A', 'Laboratório', 16),
('A6 - PNEUMÁTICA', 'Equipamentos Pneumáticos e Hidráulicos', 'A', 'Laboratório', 20),
('B2 - AULA', 'Sala de Aula', 'B', 'Sala', 32),
('B3 - AULA', 'Sala de Aula', 'B', 'Sala', 32),
('B5 - AULA', 'Sala de Aula', 'B', 'Sala', 40),
('B6 - AULA', 'Sala de Aula', 'B', 'Sala', 32),
('B7 - AULA', 'Sala de Aula', 'B', 'Sala', 32),
('B8 - INFORMÁTICA', 'Laboratório de Informática', 'B', 'Laboratório', 20),
('B9 - INFORMÁTICA', 'Estação de Trabalho', 'B', 'Laboratório', 16),
('B10 - INFORMÁTICA', 'Computadores Programáveis', 'B', 'Laboratório', 16),
('B11 - INFORMÁTICA', 'Equipamentos de Rede', 'B', 'Laboratório', 40),
('B12 - INFORMÁTICA', 'Laboratório de TI', 'B', 'Laboratório', 40),
('CA - Colorado A1', 'Sala Multimídia', 'C', 'Sala', 16),
('COF - Colorado Oficina', 'Ferramentas Manuais', 'C', 'Oficina', 16),
('C1 - AULA (ALP)', 'Sala de Aula (ALP)', 'C', 'Sala', 24),
('C2 - INFORMATICA', 'Software Educacional', 'C', 'Laboratório', 32),
('C3 - MODELAGEM', 'Máquinas de Costura', 'C', 'Oficina', 20),
('C4 - MODELAGEM', 'Equipamentos de Modelagem', 'C', 'Oficina', 20),
('C5 - AULA', 'Materiais Didáticos', 'C', 'Sala', 16),
('D1 - MODELAGEM', 'Ferramentas de Modelagem', 'D', 'Oficina', 16),
('D2 - MODELAGEM', 'Estações de Trabalho de Modelagem', 'D', 'Oficina', 20),
('D3 - AULA', 'Quadro e Projetor', 'D', 'Sala', 16),
('D4 - CRIAÇÃO', 'Materiais de Artesanato', 'D', 'Oficina', 18),
('LAB - ALIMENTOS', 'Equipamentos de Cozinha', 'L', 'Laboratório', 16),
('OFI - AJUSTAGEM/FRESAGEM', 'Máquinas de Fresagem', 'O', 'Oficina', 16),
('OFI - COMANDOS ELÉTRICOS', 'Circuitos Elétricos', 'O', 'Oficina', 16),
('OFI - TORNEARIA', 'Torno Mecânico', 'O', 'Oficina', 20),
('OFI - SOLDAGEM', 'Equipamentos de Solda', 'O', 'Oficina', 16),
('OFI - MARCENARIA', 'Ferramentas de Marcenaria', 'O', 'Oficina', 16),
('OFI - LIXAMENTO', 'Lixadeiras e Polidoras', 'O', 'Oficina', 16);

INSERT INTO reserva (data, hora_inicio, hora_fim, dia_semana, fk_id_usuario, fk_id_sala) VALUES
('2025-12-31', '07:00:00', '08:00:00', 'Quarta-Feira', 1, 1),
('2025-12-31', '08:00:00', '09:00:00', 'Quarta-Feira', 1, 1),
('2025-12-31', '09:00:00', '10:00:00', 'Quarta-Feira', 1, 1),
('2025-12-31', '10:00:00', '11:00:00', 'Quarta-Feira', 1, 1),
('2025-12-31', '11:00:00', '12:00:00', 'Quarta-Feira', 1, 1);

-- ================================
--  Views
-- ================================

-- VIEW: conta quantas reservas cada usuário tem

CREATE VIEW cru AS
SELECT 
    u.id_usuario, 
    u.nome, 
    COUNT(r.id_reserva) AS total_reservas
FROM 
    usuario u
LEFT JOIN 
    reserva r ON u.id_usuario = r.fk_id_usuario
GROUP BY 
    u.id_usuario, u.nome;

-- VIEW: lista as reservas de forma mais detalhada

CREATE VIEW rd AS 
SELECT 
    r.id_reserva,
    r.data,
    r.dia_semana,
    r.hora_inicio, 
    r.hora_fim,
    s.id_sala AS sala_id_sala, 
    s.nome AS sala_nome, 
    u.nome AS usuario_nome
FROM 
    reserva r
JOIN 
    sala s ON r.fk_id_sala = s.id_sala
JOIN 
    usuario u ON r.fk_id_usuario = u.id_usuario;

-- ================================
--  Functions
-- ================================

-- FUNCTION: total de reservas em uma determinada sala para um determinado dia

DELIMITER //

CREATE FUNCTION TotalReservasPorSalaEDia(salaId INT, dataReserva DATE)
RETURNS INT
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total INT;

    SELECT COUNT(*) INTO total
    FROM reserva
    WHERE fk_id_sala = salaId AND data = dataReserva;

    RETURN total;
END; //

DELIMITER ;

-- ================================
--  Procedures
-- ================================

-- PROCEDURE: listar histórico de reservas de um usuário

DELIMITER //

CREATE PROCEDURE HistoricoReservaUsuario (p_id_usuario INT)
BEGIN
    SELECT data, hora_inicio, hora_fim, fk_id_sala
    FROM reserva
    WHERE p_id_usuario = fk_id_usuario AND data < CURDATE();
END; //

CREATE PROCEDURE buscarSalasNome (IN p_termo VARCHAR(100))
BEGIN
    SELECT *
    FROM sala
    WHERE nome LIKE CONCAT('%', p_termo, '%')
       OR descricao LIKE CONCAT('%', p_termo, '%');
END; //

DELIMITER ;

-- PROCEDURE: filtro de salas pelo nome ou descrição

DELIMITER //

CREATE PROCEDURE buscarSalasNome (
  IN p_termo VARCHAR(100)
)

BEGIN
  SELECT *
  FROM sala
  WHERE nome LIKE CONCAT('%', p_termo, '%')
     OR descricao LIKE CONCAT('%', p_termo, '%');

END //

DELIMITER ;

-- ================================
--  Triggers e Tabela de histórico
-- ================================

-- Criação de tabela para armazenar os dados

CREATE TABLE logreserva (
  id_historico INT AUTO_INCREMENT PRIMARY KEY,
  nome_sala VARCHAR(100),
  data DATE,
  hora_inicio TIME,
  hora_fim TIME,
  data_delecao DATETIME
);

-- TRIGGER: armazenar histórico de deleção de reservas

DELIMITER //

CREATE TRIGGER salvarHistoricoDelecao
AFTER DELETE ON reserva
FOR EACH ROW
BEGIN
  DECLARE nomeSala VARCHAR(100);

  SELECT nome INTO nomeSala FROM sala WHERE id_sala = OLD.fk_id_sala;

  INSERT INTO logreserva (
    nome_sala,
    data,
    hora_inicio,
    hora_fim,
    data_delecao
  )
  VALUES (
    nomeSala,
    OLD.data,
    OLD.hora_inicio,
    OLD.hora_fim,
    NOW()
  );
END; //

DELIMITER ;