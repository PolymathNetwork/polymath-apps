// @flow

import logger from 'winston';

const { format, transports } = logger;

logger.add(
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.prettyPrint(),
      format.printf(
        info => `[${info.timestamp}] ${info.level}: ${info.message}`
      )
    ),
    level: 'debug',
  })
);
