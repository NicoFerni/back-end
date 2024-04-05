import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

    @Injectable()
    export class LanguagesService {
        constructor (private httpService: HttpService) {}

        getLanguages(){
            return  {
                af: 'Afrikaans',
                ar: 'Arabic',
                az: 'Azeri',
                bg: 'Bulgarian',
                br: 'Brazilian Portuguese',
                ca: 'Catalan',
                cs: 'Czech',
                da: 'Canadian French',
                de: 'German',
                dk: 'Danish',
                el: 'Greek',
                en: 'English',
                es: 'Spanish',
                et: 'Estonian',
                fa: 'Farsi',
                fi: 'Finnish',
                fr: 'French',
                fy: 'Frisian',
                he: 'Hebrew',
                hi: 'Hindi',
                hr: 'Croatian',
                hu: 'Hungarian',
                id: 'Indonesian',
                is: 'Icelandic',
                it: 'Italian',
                ja: 'Japanese',
                ko: 'Korean',
                la: 'Latin',
                lt: 'Lithuanian',
                lv: 'Latvian',
                ml: 'Malay',
                nl: 'Dutch',
                no: 'Norwegian',
                pl: 'Polish',
                prs: 'Dari',
                ps: 'Pashto',
                pt: 'Portuguese',
                ro: 'Romanian',
                ru: 'Russian',
                sk: 'Slovak',
                sl: 'Slovenian',
                sr: 'Serbian',
                sv: 'Swedish',
                th: 'Thai',
                tr: 'Turkish',
                tw: 'Traditional Chinese',
                uk: 'Ukrainian',
                ur: 'Urdu',
                vi: 'Vietnamese',
                zh: 'Simplified Chinese'
            }
        }
    }