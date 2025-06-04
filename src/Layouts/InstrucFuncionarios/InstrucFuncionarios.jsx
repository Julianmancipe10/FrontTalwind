import React, { useState, useEffect, useRef, useCallback } from 'react';
import profesor1 from '../../assets/images/optimized/optimized_profesor1.jpg';
import profesor2 from '../../assets/images/optimized/optimized_profesor2.jpg';
import profesor3 from '../../assets/images/optimized/optimized_profesor3.jpg';
import profesor4 from '../../assets/images/optimized/optimized_profesor4.jpg';
import profesor5 from '../../assets/images/optimized/optimized_profesor5.jpg';
import profesor6 from '../../assets/images/optimized/optimized_profesor6.jpg';
import profesor7 from '../../assets/images/optimized/optimized_profesor7.jpg';
import profesor8 from '../../assets/images/optimized/optimized_profesor8.jpg';
import profesor9 from '../../assets/images/optimized/optimized_profesor9.jpg';
import profesor10 from '../../assets/images/optimized/optimized_profesor10.jpg';
import InstructorModal from '../../components/InstructorModal';

const InstrucFuncionarios = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const sectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const ANIMATION_INTERVAL = 6000;

  const instructores = [
    {
      id: 1,
      imagen: profesor1,
      calificacion: 4.5,
      nombre: 'Carlos Rodríguez',
      especialidad: 'Desarrollo Web Frontend',
      experiencia: '8 años de experiencia en desarrollo web y 5 años como instructor',
      cursos: ['React JS', 'JavaScript Avanzado', 'HTML5 y CSS3'],
      email: 'carlos.rodriguez@sena.edu.co'
    },
    {
      id: 2,
      imagen: profesor2,
      calificacion: 5,
      nombre: 'Ana María López',
      especialidad: 'Desarrollo Backend',
      experiencia: '10 años en desarrollo de software y 6 años como instructora',
      cursos: ['Node.js', 'Python', 'Bases de Datos'],
      email: 'ana.lopez@sena.edu.co'
    },
    {
      id: 3,
      imagen: profesor3,
      calificacion: 4,
      nombre: 'Juan Pablo Martínez',
      especialidad: 'Diseño UX/UI',
      experiencia: '7 años en diseño de interfaces y 4 años como instructor',
      cursos: ['Diseño de Interfaces', 'Figma Avanzado', 'Principios de UX'],
      email: 'juan.martinez@sena.edu.co'
    },
    {
      id: 4,
      imagen: profesor4,
      calificacion: 4.5,
      nombre: 'María Fernanda Torres',
      especialidad: 'Desarrollo Móvil',
      experiencia: '6 años en desarrollo móvil y 3 años como instructora',
      cursos: ['React Native', 'Flutter', 'Desarrollo iOS'],
      email: 'maria.torres@sena.edu.co'
    },
    {
      id: 5,
      imagen: profesor5,
      calificacion: 5,
      nombre: 'Diego Sánchez',
      especialidad: 'Ciberseguridad',
      experiencia: '12 años en seguridad informática y 5 años como instructor',
      cursos: ['Ethical Hacking', 'Seguridad en Redes', 'Criptografía'],
      email: 'diego.sanchez@sena.edu.co'
    },
    {
      id: 6,
      imagen: profesor6,
      calificacion: 4,
      nombre: 'Laura Gómez',
      especialidad: 'Ciencia de Datos',
      experiencia: '9 años en análisis de datos y 4 años como instructora',
      cursos: ['Machine Learning', 'Python para Data Science', 'Big Data'],
      email: 'laura.gomez@sena.edu.co'
    },
    {
      id: 7,
      imagen: profesor7,
      calificacion: 4.5,
      nombre: 'Andrés Ramírez',
      especialidad: 'DevOps',
      experiencia: '8 años en DevOps y 4 años como instructor',
      cursos: ['Docker', 'Kubernetes', 'CI/CD'],
      email: 'andres.ramirez@sena.edu.co'
    },
    {
      id: 8,
      imagen: profesor8,
      calificacion: 5,
      nombre: 'Carolina Herrera',
      especialidad: 'Gestión de Proyectos',
      experiencia: '10 años en gestión de proyectos y 6 años como instructora',
      cursos: ['Metodologías Ágiles', 'Scrum', 'Gestión de Equipos'],
      email: 'carolina.herrera@sena.edu.co'
    },
    {
      id: 9,
      imagen: profesor9,
      calificacion: 4,
      nombre: 'Roberto Mendoza',
      especialidad: 'Inteligencia Artificial',
      experiencia: '7 años en IA y 3 años como instructor',
      cursos: ['Deep Learning', 'Redes Neuronales', 'Procesamiento de Lenguaje Natural'],
      email: 'roberto.mendoza@sena.edu.co'
    },
    {
      id: 10,
      imagen: profesor10,
      calificacion: 4.5,
      nombre: 'Patricia Valencia',
      especialidad: 'Cloud Computing',
      experiencia: '9 años en cloud y 5 años como instructora',
      cursos: ['AWS', 'Azure', 'Google Cloud'],
      email: 'patricia.valencia@sena.edu.co'
    }
  ];

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setCardsToShow(1);
    } else if (width < 1024) {
      setCardsToShow(2);
    } else {
      setCardsToShow(3);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const updateSlide = useCallback(() => {
    const currentTime = performance.now();
    if (currentTime - lastUpdateTimeRef.current >= ANIMATION_INTERVAL) {
      setCurrentIndex((prevIndex) => 
        prevIndex === instructores.length - cardsToShow ? 0 : prevIndex + 1
      );
      lastUpdateTimeRef.current = currentTime;
    }
    animationFrameRef.current = requestAnimationFrame(updateSlide);
  }, [cardsToShow, instructores.length]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateSlide);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateSlide]);

  const renderEstrellas = useCallback((calificacion) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-base md:text-lg transition-colors duration-300 ${
          i < calificacion ? 'text-yellow-400' : 'text-gray-400'
        }`}
      >
        ★
      </span>
    ));
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-[#1a1f2e] font-poppins overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8">
          Nuestros Instructores
        </h2>
        
        <div className="relative">
          <div className="flex flex-nowrap gap-4 md:gap-6 transition-transform duration-500 ease-in-out">
            {instructores.slice(currentIndex, currentIndex + cardsToShow).map((instructor) => (
              <div 
                key={instructor.id} 
                className={`flex-none ${
                  cardsToShow === 1 ? 'w-[85%] mx-auto' : 
                  cardsToShow === 2 ? 'w-[calc(50%-12px)]' : 
                  'w-[calc(33.333%-16px)]'
                }`}
              >
                <div className="bg-[#242937] rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={instructor.imagen} 
                      alt={instructor.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg md:text-xl font-semibold text-white text-center mb-2">
                      {instructor.nombre}
                    </h3>
                    <p className="text-gray-400 text-sm text-center mb-2">
                      {instructor.especialidad}
                    </p>
                    <div className="flex justify-center gap-1 mb-3">
                      {renderEstrellas(instructor.calificacion)}
                    </div>
                    <button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-300 text-sm md:text-base"
                      onClick={() => setSelectedInstructor(instructor)}
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-1.5">
            {Array.from({ length: Math.ceil(instructores.length / cardsToShow) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * cardsToShow)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === Math.floor(currentIndex / cardsToShow)
                    ? 'bg-green-500 w-4'
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 bg-[#242937] rounded-2xl p-6 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            Califica Tus Instructores
          </h3>
          <p className="text-gray-400 text-sm md:text-base mb-4">
            Tu opinión nos ayuda a mejorar la calidad de nuestra enseñanza
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-300">
            Calificar
          </button>
        </div>
      </div>

      {selectedInstructor && (
        <InstructorModal
          instructor={selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
        />
      )}
    </section>
  );
};

export default InstrucFuncionarios;
