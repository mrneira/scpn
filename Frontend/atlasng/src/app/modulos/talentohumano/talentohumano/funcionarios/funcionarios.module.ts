import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { FuncionariosRoutingModule } from './funcionarios.routing';
import { FuncionariosComponent } from './componentes/funcionarios.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { InformacionPersonalModule } from './submodulos/infpersonal/_infpersonal.module';
import { ContactosModule } from './submodulos/contactos/_contactos.module';
import { FamiliaresModule } from './submodulos/cargasfamiliares/_familiares.module';
import { EnfermedadesModule } from './submodulos/enfermedades/_enfermedades.module';
import {ConfirmDialogModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, FuncionariosRoutingModule, 
    InformacionPersonalModule, ContactosModule, FamiliaresModule, EnfermedadesModule, 
    LovFuncionariosModule, ConfirmDialogModule],
  declarations: [FuncionariosComponent]
})
export class FuncionariosModule { }
