import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class TechnologiesService {
  constructor(
    private httpService: HttpService,
  ) { }
  getTechnologies(): object {

    const programingLanguagesList =
    {
      "conocimientos": [
        {
          "nombre": "Python",
          "frameworks": ["Django", "Flask", "PyTorch", "TensorFlow"]
        },
        {
          "nombre": "JavaScript",
          "frameworks": ["React", "Angular", "Vue.js", "Node.js"]
        },
        {
          "nombre": "Java",
          "frameworks": ["Spring", "Hibernate", "Struts"]
        },
        {
          "nombre": "C++",
          "frameworks": ["Qt", "Boost", "Poco"]
        },
        {
          "nombre": "C#",
          "frameworks": [".NET", "Unity", "Xamarin"]
        },
        {
          "nombre": "Go",
          "frameworks": ["Revel", "Gin", "Echo"]
        },
        {
          "nombre": "Rust",
          "frameworks": ["Rocket", "Actix", "Tide"]
        },
        {
          "nombre": "Kotlin",
          "frameworks": ["Ktor", "Spring Boot", "Vert.x"]
        },
        {
          "nombre": "Swift",
          "frameworks": ["UIKit", "SwiftUI", "Vapor"]
        },
        {
          "nombre": "TypeScript",
          "frameworks": ["Angular", "React", "Vue.js"]
        },
        {
          "nombre": "Ruby",
          "frameworks": ["Ruby on Rails", "Sinatra", "Hanami"]
        },
        {
          "nombre": "PHP",
          "frameworks": ["Laravel", "Symfony", "CodeIgniter"]
        },
        {
          "nombre": "Dart",
          "frameworks": ["Flutter", "AngularDart", "Aqueduct"]
        },
        {
          "nombre": "HTML",
          "frameworks": ["Semantic UI"]
        },
        {
          "nombre": "CSS",
          "frameworks": ["Bootstrap", "Tailwind CSS", "Bulma", "Materialize"]
        },
        {
          "nombre": "Git/GitHub",
          "frameworks": ["GitHub Pages", "GitHub Actions", "Git LFS"]
        }
      ]
    }


    return programingLanguagesList
  }
}
