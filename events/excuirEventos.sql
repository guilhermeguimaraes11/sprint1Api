create event if not exists excluir_eventos_antigos
    on schedule every 1 week
    starts current_timestamp + interval 5 minute
    on completion preserve
    enable
do
    delete from evento 
    where data_hora < now() - interval 1 year;

    INSERT INTO evento (id_evento, nome, descricao, data_hora, local, fk_id_organizador)
VALUES (2001, 'Evento Antigo', 'teste teste', NOW() - INTERVAL 2 YEAR, 'Franca-SP', 1);