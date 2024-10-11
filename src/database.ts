import 'reflect-metadata';
import pg from 'pg';
import { DataSource, QueryRunner } from 'typeorm';
import { configDB } from './config/database';

pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number);

export const Database = new DataSource(configDB());

export async function getQueryRunner(start = true): Promise<QueryRunner> {
	const qr = Database.createQueryRunner();

	if (start) {
		await qr.connect();
		await qr.startTransaction();
	}

	return qr;
}

export async function commit(qr: QueryRunner): Promise<void> {
	if (!qr) {
		return;
	}

	await qr.commitTransaction();

	release(qr);
}

export async function rollback(qr: QueryRunner): Promise<void> {
	if (!qr) {
		return;
	}

	if (qr.isTransactionActive) {
		await qr.rollbackTransaction();
	}

	release(qr);
}

export async function release(qr: QueryRunner): Promise<void> {
	await qr.release();
}