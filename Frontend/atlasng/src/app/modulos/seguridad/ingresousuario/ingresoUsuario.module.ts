import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { IngresoUsuarioRoutingModule } from './ingresoUsuario.routing';

import { IngresoUsuarioComponent } from './componentes/ingresoUsuario.component';
import { UsuarioDetalleComponent } from './componentes/_usuarioDetalle.component';
import { UsuarioRolComponent } from './componentes/_usuarioRol.component';
import { LovFuncionariosModule } from '../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, IngresoUsuarioRoutingModule, LovFuncionariosModule],
  declarations: [IngresoUsuarioComponent, UsuarioDetalleComponent, UsuarioRolComponent]
})
export class IngresoUsuarioModule { }
