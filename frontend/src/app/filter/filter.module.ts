import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';

import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SidenavFilterComponent} from "./component/sidenav/sidenav-filter.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FiltersComponent} from "./component/filters.component";
import {FilterComponent} from "./component/filter.component";
import {FilterGroupsComponent} from "./component/filter-groups.component";
import {FilterBooleanComponent} from "./component/filter-types/filter-boolean.component";
import {FilterIntervalComponent} from "./component/filter-types/filter-interval.component";
import {FilterMultiselectComponent} from "./component/filter-types/filter-multiselect.component";
import {FilterStringComponent} from "./component/filter-types/filter-string.component";
import {TagInputModule} from "ngx-chips";
import {CommonModule} from "../common/common.module";

@NgModule({
  declarations: [
    SidenavFilterComponent,
    FilterGroupsComponent,
    FiltersComponent,
    FilterComponent,
    FilterBooleanComponent,
    FilterIntervalComponent,
    FilterMultiselectComponent,
    FilterStringComponent
  ],
  exports: [
    SidenavFilterComponent
  ],
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTooltipModule,
    TagInputModule,
    CommonModule
  ],
})
export class FilterModule {
}
