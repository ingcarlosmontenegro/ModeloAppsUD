var schema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: 20081530099,
        code: 20081530099,
        firstName: {
          type: 'string',
          faker: 'name.firstName'
        },
        lastName: {
          type: 'string',
          faker: 'name.lastName'
        },
        email: {
          type: 'string',
          faker: {'internet.email': ['#{firstName}', '#{lastName}', 'gmail.com']}
        },
        avatar: {
          type: 'string',
          faker: 'image.avatar'
        }
      },
      required: ['id', 'code', 'firstName', 'lastname', 'email', 'avatar']
    },
    grades: {
      type: 'array',
      minItems: 4, maxItems: 7,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            autoIncrement: true
          },
          course: {
            type: 'object',
            properties: {
              id: { $ref: '#/definitions/course_code' },
              code: { $ref: '#/definitions/course_code' },
              name: { $ref: '#/definitions/course_name' },
              group: {
                type: 'number',
                faker: {'random.number': {min: 0, max: 5, precision: 1}}
              },
              status: { $ref: '#/definitions/grades_status' },
              current: { $ref: '#/definitions/grades_value' },
              final: { $ref: '#/definitions/grades_value' },
              partials: {
                type: 'array',
                minItems: 2, maxItems: 7,
                items: {
                  type: 'object',
                  properties: {
                    id: { $ref: '#/definitions/uuid' },
                    name: { $ref: '#/definitions/grades_name' },
                    percent: { $ref: '#/definitions/percent' },
                    value: { $ref: '#/definitions/grades_value' }
                  }
                }
              }
            }
          }
        },
        required: ['id', 'course']
      }
    },
  },
  required: ['user', 'grades'],
  definitions: {
    course_code: {
      type: 'integer',
      minimum: 20765400,
      maximum: 20766400,
      autoIncrement: true,
      exclusiveMinimum: true
    },
    course_name: {
      enum: [
        'Matemáticas Avanzadas', 'Ciencias de la computación',
        'Historia del Arte', 'Sociedad y consumo',
        'Dibujo Técnico II', 'Física I',
        'Dibujo Técnico I', 'Historia del Cine',
        'Cátedra FJC', 'Filosofía II',
      ]
    },
    grades_status: {
      enum: [
        'Sin Observacion', 'Habilitó', 'Perdió Por Fallas',
        'Incompleta', 'Pendiente', 'Examen Anulado',
        'Aprobado', 'No Aprobado'
      ]
    },
    grades_name: {
      enum: [
        'Parcial 1', 'Parcial 2', 'Parcial 3', 'Parcial 4',
        'Laboratorio', 'Exámen', 'Habilitación'
      ]
    },
    grades_value: {
      type: 'string',
      faker: {'random.number': {min: 0, max: 5, precision: 0.01}}
    },
    uuid: {
      type: 'string',
      faker: 'random.uuid'
    },
    percent: {
      type: 'string',
      faker: {'random.number': {min: 0, max: 100, precision: 0.01}}
    }
  }
};

module.exports = schema;
