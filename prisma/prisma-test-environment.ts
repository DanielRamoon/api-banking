import type {
  JestEnvironmentConfig,
  EnvironmentContext
} from '@jest/environment'
import { exec } from 'node:child_process'
import dotenv from 'dotenv'
import NodeEnvironment from 'jest-environment-node'
import { Client } from 'pg'
import util from 'node:util'
import crypto from 'node:crypto'

dotenv.config({ path: '.env.testing' })

const execSync = util.promisify(exec)

const prismaBinary = './node_modules/.bin/prisma'

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string
  private connectionString: string

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context)

    const {
      DATABASE_USER,
      DATABASE_PASS,
      DATABASE_HOST,
      DATABASE_PORT,
      DATABASE_NAME
    } = process.env

    this.schema = `test_${crypto.randomUUID()}`
    // eslint-disable-next-line max-len
    this.connectionString = `postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=${this.schema}`
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    await execSync(`${prismaBinary} migrate deploy`)

    return super.setup()
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString
    })

    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
  }
}
