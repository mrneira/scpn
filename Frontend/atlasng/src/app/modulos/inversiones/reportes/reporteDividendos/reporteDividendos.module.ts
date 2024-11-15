import { NgModule } from "@angular/core";
import { JasperModule } from "app/util/componentes/jasper/jasper.module";
import { SharedModule } from "app/util/shared/shared.module";
import { SpinnerModule } from "primeng/primeng";
import { ReporteDividendosComponent } from "./componentes/reporteDividendos.components";
import { ReporteDividendosRoutingModule } from "./reporteDividendos.routing";

@NgModule({
  imports: [SharedModule, ReporteDividendosRoutingModule, JasperModule, SpinnerModule ],
  declarations: [ReporteDividendosComponent]
})
export class ReporteDividendosModule { }
