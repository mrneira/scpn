import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InformacionAcademicaRoutingModule } from './informacionacademica.routing';
import { InformacionAcademicaComponent } from './componentes/informacionacademica.component';
import { InstitucionFormalModule } from './submodulos/institucionformal/_institucionformal.module';
import { CapacitacionModule } from './submodulos/capacitacion/_capacitacion.module';
import { IdiomasModule } from './submodulos/idiomas/_idiomas.module';

import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { LovTituloModule } from '../../lov/titulo/lov.titulo.module';



@NgModule({
  imports: [SharedModule, InformacionAcademicaRoutingModule,InstitucionFormalModule,IdiomasModule,CapacitacionModule,
    LovFuncionariosModule,  ],
  declarations: [InformacionAcademicaComponent]
})
export class InformacionAcademicaModule { }
