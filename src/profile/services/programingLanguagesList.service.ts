import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

    @Injectable()
    export class TechnologiesService {
        constructor (
            private httpService: HttpService,
            ) {}
    getTechnologies() : object{

    const programingLanguagesList = {
        "Python": {
            "frameworks": ["Django", "Flask", "PyTorch", "TensorFlow"]
        },
        "JavaScript": {
            "frameworks": ["React", "Angular", "Vue.js", "Node.js"]
        },
        "Java": {
            "frameworks": ["Spring", "Hibernate", "Struts"]
        },
        "C++": {
            "frameworks": ["Qt", "Boost", "Poco"]
        },
        "C#": {
            "frameworks": [".NET", "Unity", "Xamarin"]
        },
        "Go": {
            "frameworks": ["Revel", "Gin", "Echo"]
        },
        "Rust": {
            "frameworks": ["Rocket", "Actix", "Tide"]
        },
        "Kotlin": {
            "frameworks": ["Ktor", "Spring Boot", "Vert.x"]
        },
        "Swift": {
            "frameworks": ["UIKit", "SwiftUI", "Vapor"]
        },
        "TypeScript": {
            "frameworks": ["Angular", "React", "Vue.js"]
        },
        "Ruby": {
            "frameworks": ["Ruby on Rails", "Sinatra", "Hanami"]
        },
        "PHP": {
            "frameworks": ["Laravel", "Symfony", "CodeIgniter"]
        },
        "Dart": {
            "frameworks": ["Flutter", "AngularDart", "Aqueduct"]
        },
        "HTML": {
            "frameworks": ["Semantic UI"]
        },
        "CSS": {
            "frameworks": ["Bootstrap", "Tailwind CSS", "Bulma", "Materialize"]
        },
        "Git/GitHub": {
            "frameworks": ["GitHub Pages", "GitHub Actions", "Git LFS"]
        }
    }
    
    return  programingLanguagesList
}
}