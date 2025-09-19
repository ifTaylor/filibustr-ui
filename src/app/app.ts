import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import {Footer} from "./components/footer/footer";

@Component({
  standalone: true,
  selector: 'app-root',
    imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected title = 'filibustr-ui';
}
