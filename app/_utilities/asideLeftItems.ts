import { 
    SportsEsportsOutlined,
    SportsEsports,
    SportsBaseball,
    SportsBaseballOutlined,
    Business,
    Tv,
    Star,
    StarOutline,
    Pets,
    Face3,
    Face3Outlined,
    ColorLens,
    ColorLensOutlined,
    DirectionsCar,
    DirectionsCarOutlined,
    AutoAwesome,
    AutoAwesomeOutlined,
    Diversity3,
    AccountBalance,
    AccountBalanceOutlined,
    Checkroom,
    Restaurant,
    AutoStories,
    AutoStoriesOutlined,
    Skateboarding,
    Gavel,
    School,
    SchoolOutlined,
    TheatersOutlined,
    LibraryMusic,
    LibraryMusicOutlined,
    Place,
    PlaceOutlined,
    SettingsInputAntenna,
    HowToVote,
    HowToVoteOutlined,
    Terminal,
    LocalLibrary,
    LocalLibraryOutlined,
    Church,
    ChurchOutlined,
    Science,
    ScienceOutlined,
    Smartphone,
} from "@mui/icons-material";

import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface IconTema {
    titulo: string;
    path: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {muiName: string;};
    iconPath?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {muiName: string;};
}

export const iconsTemas = <IconTema[]>[
    {titulo: 'Videojuegos', path: '/videojuegos', icon: SportsEsportsOutlined, iconPath: SportsEsports},
    {titulo: 'Deportes', path: '/deportes', icon: SportsBaseballOutlined, iconPath: SportsBaseball},
    {titulo: 'Negocios', path: '/negocios', icon: Business},
    {titulo: 'Televisión', path: '/tv', icon: Tv},
    {titulo: 'Famosos', path: '/famosos', icon: StarOutline, iconPath: Star},
    {titulo: 'Animales / Mascotas', path: '/animales-mascotas', icon: Pets},
    {titulo: 'Anime / Animacion', path: '/anime-animacion', icon: Face3Outlined, iconPath: Face3},
    {titulo: 'Arte', path: '/arte', icon: ColorLensOutlined, iconPath: ColorLens},
    {titulo: 'Autos / Motores / Vehiculos de motor', path: '/vehiculos', icon: DirectionsCarOutlined, iconPath: DirectionsCar},
    {titulo: 'Manualidades', path: '/manualidades', icon: AutoAwesomeOutlined, iconPath: AutoAwesome},
    {titulo: 'Cultura, Razas y Etnias', path: '/cultura', icon: Diversity3},
    {titulo: 'Ética y filosofia', path: '/etica-filosofia', icon: AccountBalanceOutlined, iconPath: AccountBalance},
    {titulo: 'Moda', path: '/moda', icon: Checkroom},
    {titulo: 'Comidas / Bebidas', path: '/comidas-bebidas', icon: Restaurant},
    {titulo: 'Historia', path: '/historia', icon: AutoStoriesOutlined, iconPath: AutoStories},
    {titulo: 'Hobbies', path: '/hobbies', icon: Skateboarding},
    {titulo: 'Derecho', path: '/derecho', icon: Gavel},
    {titulo: 'Aprendizaje / Educacion', path: '/educacion', icon: SchoolOutlined, iconPath: School},
    {titulo: 'Cine', path: '/cine', icon: TheatersOutlined},
    {titulo: 'Música', path: '/musica', icon: LibraryMusicOutlined, iconPath: LibraryMusic},
    {titulo: 'Lugares', path: '/lugares', icon: PlaceOutlined, iconPath: Place},
    {titulo: 'Podcast / Streaming', path: '/podcast-streaming', icon: SettingsInputAntenna},
    {titulo: 'Politica', path: '/politica', icon: HowToVoteOutlined, iconPath: HowToVote},
    {titulo: 'Programacion', path: '/programacion', icon: Terminal},
    {titulo: 'Lectura / Literatura / Escritura', path: '/literatura', icon: LocalLibraryOutlined, iconPath: LocalLibrary},
    {titulo: 'Religion / Espiritualidad', path: '/religion-espiritualidad', icon: ChurchOutlined, iconPath: Church},
    {titulo: 'Ciencia', path: '/ciencia', icon: ScienceOutlined, iconPath: Science},
    {titulo: 'Tecnología', path: '/tecnologia', icon: Smartphone},
]
