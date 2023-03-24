import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  // LLenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  // UI\
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges.subscribe((region) => {
    //   console.log(region);

    //   this.paisesService.getPaisesPorRegion(region).subscribe((paises) => {
    //     console.log(paises);
    //     this.paises = paises;
    //   });
    // });


    //switch map regresa un observable a partir del primer observable

    //tap es para acciones secundarias: reste de un campo

    // cuando cambie la region
    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap( ( _ )=> {
          this.miFormulario.get('pais')?.reset('');
          this.cargando=true;
        }),
        switchMap((region) => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.cargando=false;
        // console.log(paises);
        this.paises=paises;
      });


      // Cuando cambia el pais
      this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( (_) =>{
          // this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando=true;
        }),
        switchMap(
          codigo => this.paisesService.getPaisPorCodigo(codigo)
        ),
        switchMap( pais => this.paisesService.gePaisesPorcodigos( pais?.borders! ))
      )
      .subscribe(
        paises =>{
          this.fronteras=paises;
          this.cargando=false;
          // console.log(pais);
          // this.fronteras = pais?.borders || [];
        }
      )
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
