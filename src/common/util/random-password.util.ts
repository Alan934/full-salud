import {
  InstitutionApplication,
  SpecialistApplication
} from '../../domain/entities';
import { Base } from '../bases/base.entity';
import { ErrorManager } from '../exceptions/error.manager';

function getRandomCharacter(): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

export function generatedRandomPassword(entity: Base): string {
  let password: string;

  if (
    entity instanceof InstitutionApplication ||
    entity instanceof SpecialistApplication
  ) {
    const username = entity.userApplication.email.split('@')[0];
    const randomCharacters = Array(4)
      .fill(null)
      .map(() => getRandomCharacter())
      .join('');
    password = `${username}${randomCharacters}!`;
  } else {
    throw ErrorManager.createSignatureError(
      `unidentified entity: expected either SpecialistApplication or InstitutionApplication`
    );
  }

  if (password.length < 6) {
    password = password.padEnd(6, '!'); // Agrega ! hasta que la longitud sea igual a seis
  }

  return password;
}
