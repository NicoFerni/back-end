import { Profile } from "./profile.entity";
import { User } from "./user.entity";
import { Redes } from "./socialNetworks.entity";
import { disponibilidad } from "./availability.entity";

const entities = [User, Profile, Redes, disponibilidad];

export {User, Profile, Redes, disponibilidad};
export default entities;