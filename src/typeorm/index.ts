import { Profile } from "./profile.entity";
import { User } from "./user.entity";
import { Redes } from "./redes.entity";
import { Disponibilidad } from "./availability.entity";

const entities = [User, Profile, Redes, Disponibilidad];

export {User, Profile, Redes, Disponibilidad};
export default entities;