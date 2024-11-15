import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { PersonasRelacionRoutingModule } from './_personasRelacion.routing';
import { PersonasRelacionComponent } from './componentes/_personasRelacion.component';
import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, PersonasRelacionRoutingModule, LovPersonasModule ],
  declarations: [PersonasRelacionComponent],
  exports: [PersonasRelacionComponent]

})
export class PersonasRelacionModule { }
