import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { MantUsuarioRoutingModule } from './mantUsuario.routing';

import { MantUsuarioComponent } from './componentes/mantUsuario.component';
import { UsuarioDetalleComponent } from './componentes/_usuarioDetalle.component';
import { UsuarioRolComponent } from './componentes/_usuarioRol.component';
import { LovFuncionariosModule } from '../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, MantUsuarioRoutingModule, LovFuncionariosModule],
  declarations: [MantUsuarioComponent, UsuarioDetalleComponent, UsuarioRolComponent],
  exports: [UsuarioDetalleComponent]
})
export class MantUsuarioModule { }
