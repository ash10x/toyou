SELECT setval('cars_id_seq', (SELECT COALESCE(MAX(id), 0) FROM cars));
