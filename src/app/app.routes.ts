import { Routes } from '@angular/router';
import { Feed } from './pages/feed/feed';
import { ArticleCreation} from "./pages/article-creation/article-creation";

export const routes: Routes = [
    { path: '', component: Feed },
    { path: 'create-article', component: ArticleCreation },
];
