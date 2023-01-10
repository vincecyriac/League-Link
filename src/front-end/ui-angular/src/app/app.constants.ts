import { Injectable } from "@angular/core";
import {environment } from "../environments/environment"
@Injectable()
export class AppConstants {

    public static TITLE_COMMON = ' | League Link';
    public static API_URL = environment.api_url;

    // Regular expressions
    public static EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    public static NAME_REGEX = new RegExp(/^[a-zA-Z ]*$/);
    public static PASSWORD_REGEX = new RegExp(/^(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9_!@~#%{}?><\'|$&()\\*-`.+,"]+))$/);

    // Pagination constants
    public static PAGINATION_PAGE_SIZE = 5;
    public static PAGINATION_DIRECTION_LINKS = true;
    public static PAGINATION_MAX_SIZE = 2;
    public static PAGINATION_SIZE = 'sm';
}
