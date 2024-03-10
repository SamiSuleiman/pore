import { Injectable, Logger } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { definitionSeed } from './data/definition.seed';
import { exampleSeed } from './data/example.seed';
import { linkSeed } from './data/link.seed';
import { sourceSeed } from './data/source.seed';
import { tagSeed } from './data/tag.seed';
import { userSeed } from './data/user.seed';
import { wordSeed } from './data/word.seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Seeding users', 'SeedService');
    const _users = await this.entityManager
      .getRepository('User')
      .save(userSeed);
    this.logger.log(`Seeded ${_users.length} user(s)`, 'SeedService');

    this.logger.log('Seeding sources', 'SeedService');
    const _sources = await this.entityManager
      .getRepository('Source')
      .save(sourceSeed);
    this.logger.log(`Seeded ${_sources.length} source(s)`, 'SeedService');

    this.logger.log('Seeding words', 'SeedService');
    const _words = await this.entityManager
      .getRepository('Word')
      .save(wordSeed);
    this.logger.log(`Seeded ${_words.length} word(s)`, 'SeedService');

    this.logger.log('Seeding examples', 'SeedService');
    const _examples = await this.entityManager
      .getRepository('Example')
      .save(exampleSeed);
    this.logger.log(`Seeded ${_examples.length} example(s)`, 'SeedService');

    this.logger.log('Seeding definitions', 'SeedService');
    const _definitions = await this.entityManager
      .getRepository('Definition')
      .save(definitionSeed);
    this.logger.log(
      `Seeded ${_definitions.length} definition(s)`,
      'SeedService',
    );

    this.logger.log('Seeding tags', 'SeedService');
    const _tags = await this.entityManager.getRepository('Tag').save(tagSeed);
    this.logger.log(`Seeded ${_tags.length} tag(s)`, 'SeedService');

    this.logger.log('Seeding links', 'SeedService');
    const _links = await this.entityManager
      .getRepository('Link')
      .save(linkSeed);
    this.logger.log(`Seeded ${_links.length} link(s)`, 'SeedService');
  }
}
