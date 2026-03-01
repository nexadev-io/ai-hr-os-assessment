import { Prisma } from '@prisma/client';
import { TErrorSources } from '../interface/error';

const handlePrismaError = (err: any) => {
 
  let statusCode = 500;
  let message = 'Database error occurred';
  let errorSources: TErrorSources = [];

  // Prisma Known Request Error (P2000, P2001, P2002, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    
    switch (err.code) {
      case 'P2000':
        statusCode = 400;
        message = 'The provided value is too long for the field';
        errorSources = [
          {
            path: err.meta?.target as string || 'field',
            message: 'Value is too long for this field',
          },
        ];
        break;

      case 'P2001':
        statusCode = 404;
        message = 'Record not found';
        errorSources = [
          {
            path: err.meta?.cause as string || 'record',
            message: 'The requested record does not exist',
          },
        ];
        break;

      case 'P2002':
        statusCode = 409;
        message = 'Unique constraint violation';
        const targets = err.meta?.target as string[] || ['field'];
        errorSources = targets.map((target) => ({
          path: target,
          message: `${target} already exists`,
        }));
        break;

      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint violation';
        errorSources = [
          {
            path: err.meta?.field_name as string || 'field',
            message: 'Referenced record does not exist',
          },
        ];
        break;

      case 'P2004':
        statusCode = 400;
        message = 'Database constraint violation';
        errorSources = [
          {
            path: 'constraint',
            message: err.message,
          },
        ];
        break;

      case 'P2005':
        statusCode = 400;
        message = 'Invalid value for field type';
        errorSources = [
          {
            path: err.meta?.field_name as string || 'field',
            message: 'The provided value is invalid for this field type',
          },
        ];
        break;

      case 'P2006':
        statusCode = 400;
        message = 'Invalid value provided';
        errorSources = [
          {
            path: err.meta?.field_name as string || 'field',
            message: 'The provided value is not valid',
          },
        ];
        break;

      case 'P2007':
        statusCode = 400;
        message = 'Data validation error';
        errorSources = [
          {
            path: 'validation',
            message: err.message,
          },
        ];
        break;

      case 'P2008':
        statusCode = 400;
        message = 'Failed to parse query';
        errorSources = [
          {
            path: 'query',
            message: 'Query parsing failed',
          },
        ];
        break;

      case 'P2009':
        statusCode = 400;
        message = 'Failed to validate query';
        errorSources = [
          {
            path: 'query',
            message: 'Query validation failed',
          },
        ];
        break;

      case 'P2010':
        statusCode = 500;
        message = 'Raw query failed';
        errorSources = [
          {
            path: 'query',
            message: 'Database query execution failed',
          },
        ];
        break;

      case 'P2011':
        statusCode = 400;
        message = 'Null constraint violation';
        errorSources = [
          {
            path: err.meta?.target as string || 'field',
            message: 'Required field cannot be null',
          },
        ];
        break;

      case 'P2012':
        statusCode = 400;
        message = 'Missing required value';
        errorSources = [
          {
            path: err.meta?.path as string || 'field',
            message: 'Required field is missing',
          },
        ];
        break;

      case 'P2013':
        statusCode = 400;
        message = 'Missing required argument';
        errorSources = [
          {
            path: err.meta?.argument_name as string || 'argument',
            message: 'Required argument is missing',
          },
        ];
        break;

      case 'P2014':
        statusCode = 400;
        message = 'Relation violation';
        errorSources = [
          {
            path: err.meta?.relation_name as string || 'relation',
            message: 'The change would violate a required relation',
          },
        ];
        break;

      case 'P2015':
        statusCode = 404;
        message = 'Related record not found';
        errorSources = [
          {
            path: err.meta?.field_name as string || 'field',
            message: 'Related record could not be found',
          },
        ];
        break;

      case 'P2016':
        statusCode = 400;
        message = 'Query interpretation error';
        errorSources = [
          {
            path: 'query',
            message: 'Query could not be interpreted',
          },
        ];
        break;

      case 'P2017':
        statusCode = 400;
        message = 'Records not connected';
        errorSources = [
          {
            path: err.meta?.relation_name as string || 'relation',
            message: 'The records are not connected through the relation',
          },
        ];
        break;

      case 'P2018':
        statusCode = 404;
        message = 'Required connected records not found';
        errorSources = [
          {
            path: err.meta?.details as string || 'record',
            message: 'Required connected records were not found',
          },
        ];
        break;

      case 'P2019':
        statusCode = 400;
        message = 'Input error';
        errorSources = [
          {
            path: 'input',
            message: err.message,
          },
        ];
        break;

      case 'P2020':
        statusCode = 400;
        message = 'Value out of range';
        errorSources = [
          {
            path: err.meta?.field_name as string || 'field',
            message: 'Value is out of range for this field',
          },
        ];
        break;

      case 'P2021':
        statusCode = 404;
        message = 'Table does not exist';
        errorSources = [
          {
            path: err.meta?.table as string || 'table',
            message: 'The table does not exist in the database',
          },
        ];
        break;

      case 'P2022':
        statusCode = 404;
        message = 'Column does not exist';
        errorSources = [
          {
            path: err.meta?.column as string || 'column',
            message: 'The column does not exist in the database',
          },
        ];
        break;

      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        errorSources = [
          {
            path: 'record',
            message: 'An operation failed because it depends on one or more records that were required but not found',
          },
        ];
        break;

      default:
        statusCode = 500;
        message = 'Database error occurred';
        errorSources = [
          {
            path: 'database',
            message: err.message || 'Unknown database error',
          },
        ];
        break;
    }
  }
  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Prisma validation error';
    // Extract the actual validation error message from Prisma
    const errorMessage = err.message || 'Invalid data provided to the database query';
    console.error('🔴 Prisma Validation Error Details:', {
      message: errorMessage,
      stack: err.stack,
    });
    
    errorSources = [
      {
        path: 'validation',
        message: errorMessage,
      },
    ];
  }
  // Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Database connection error';
    errorSources = [
      {
        path: 'database',
        message: 'Failed to connect to the database',
      },
    ];
  }
  // Prisma Rust Panic Error
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    message = 'Database engine error';
    errorSources = [
      {
        path: 'database',
        message: 'Internal database engine error occurred',
      },
    ];
  }
  // Prisma Unknown Request Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = 'Unknown database error';
    errorSources = [
      {
        path: 'database',
        message: err.message || 'Unknown database request error',
      },
    ];
  }

  return { statusCode, message, errorSources };
};

export default handlePrismaError;
