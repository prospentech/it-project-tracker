// i18n.js - Internationalization for all South African languages
const translations = {
    en: {
        // Application
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Unified Project Tracker 2026",
        logged_in_as: "Logged in as:",
        clock_in: "CLOCK IN",
        clock_out: "CLOCK OUT",
        profile: "PROFILE",
        logout: "LOGOUT",
        
        // Footer Navigation
        tech_news: "Tech News",
        statistics: "Statistics",
        settings: "Settings",
        suggestions: "Suggestions",
        recycle_bin: "Recycle Bin",
        developer_credit: "Developed by ProspenTech.",
        all_rights_reserved: "All rights reserved.",
        
        // Language names
        english: "English",
        afrikaans: "Afrikaans",
        zulu: "isiZulu",
        xhosa: "isiXhosa",
        nso: "Sepedi",
        sesotho: "Sesotho",
        tswana: "Setswana",
        ndebele: "isiNdebele",
        swati: "siSwati",
        venda: "Tshivenda",
        tsonga: "Xitsonga",
        
        // Dashboard sections
        quick_actions: "Quick Actions",
        projects: "Projects",
        updates: "Updates",
        tasks: "Tasks",
        duties: "Performance Profile",
        clients: "ProspenTech Projects",
        meetings: "IT Meeting Minutes",
        banners: "Email Banners",
        versions: "Version Board",
        admin: "User Management",
        welcome_message: "Welcome {name}, you have {count} tasks pending.",
        no_updates: "No updates yet",
        post_update: "Post Update",
        view_all: "View All",
        
        // Project related
        project_name: "Project Name",
        project_lead: "Project Lead",
        project_status: "Status",
        project_type: "Type",
        start_date: "Start Date",
        due_date: "Due Date",
        description: "Description",
        team_members: "Team Members",
        tasks: "Tasks",
        budget: "Budget",
        notes: "Notes",
        add_project: "Add Project",
        edit_project: "Edit Project",
        delete_project: "Delete Project",
        confirm_delete: "Confirm Delete",
        
        // Task related
        task_title: "Task Title",
        assigned_to: "Assigned To",
        priority: "Priority",
        due_date: "Due Date",
        status: "Status",
        add_task: "Add Task",
        edit_task: "Edit Task",
        delete_task: "Delete Task",
        mark_complete: "Mark Complete",
        
        // Priority levels
        urgent: "Urgent",
        high: "High",
        medium: "Medium",
        low: "Low",
        normal: "Normal",
        important: "Important",
        
        // Status
        in_progress: "In Progress",
        completed: "Completed",
        pending: "Pending",
        on_hold: "On Hold",
        cancelled: "Cancelled",
        active: "Active",
        inactive: "Inactive",
        
        // Clocking
        clock_in: "CLOCK IN",
        clock_out: "CLOCK OUT",
        clocked_in: "Clocked In",
        clocked_out: "Clocked Out",
        on_time: "On Time",
        late: "Late",
        early: "Early",
        hours_worked: "Hours Worked",
        
        // Statistics
        total_projects: "Total Projects",
        total_tasks: "Total Tasks",
        total_updates: "Total Updates",
        total_users: "Total Users",
        active_users: "Active Users",
        overdue_tasks: "Overdue Tasks",
        completion_rate: "Completion Rate",
        
        // Buttons
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        close: "Close",
        confirm: "Confirm",
        back: "Back",
        
        // Messages
        success: "Success",
        error: "Error",
        warning: "Warning",
        info: "Information",
        loading: "Loading...",
        no_data: "No data available",
        are_you_sure: "Are you sure?",
        action_cannot_be_undone: "This action cannot be undone.",
        
        // Time
        today: "Today",
        this_week: "This Week",
        this_month: "This Month",
        this_year: "This Year",
        days_remaining: "Days Remaining",
        overdue: "Overdue",
        due_today: "Due Today!",
        
        // User roles
        administrator: "Administrator",
        team_member: "Team Member",
        project_lead: "Project Lead",
        
        // Features
        feature_projects: "Track all IT and design projects",
        feature_tasks: "Manage individual tasks and assignments",
        feature_updates: "Post and view team updates",
        feature_duties: "Define team roles and responsibilities",
        feature_kpis: "Track key performance indicators",
        feature_clients: "Manage client project requirements",
        feature_meetings: "Document IT meeting minutes",
        feature_banners: "Track email banner assignments",
        feature_versions: "Plan feature releases",
        feature_stats: "View attendance and system analytics",
        feature_tech_news: "Stay updated with tech trends",
        view_projects: "View Projects",
        view_tasks: "View Tasks",
        view_updates: "View Updates",
        view_all_updates: "View All Updates",
        nav_laptops: "Laptops",
        attendance_leave: "Attendance & Leave",
        performance_tracker: "Performance Tracker",
        nav_settings: "Settings",
        chat_support: "Chat Support",
        welcome_title: "Welcome!",
        section_updates: "Updates",
        recent_activity: "Recent Activity Timeline (Last 7 Days)",
        add_task: "ADD TASK",
        leave: "LEAVE"
    },
    
    af: {
        // Application
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Ontwerp Verenigde Projek Spoorder 2026",
        logged_in_as: "Aangemeld as:",
        clock_in: "KLOK IN",
        clock_out: "KLOK UIT",
        profile: "PROFIEL",
        logout: "TEKEN UIT",
        
        // Footer Navigation
        tech_news: "Tegnologie Nuus",
        statistics: "Statistieke",
        settings: "Instellings",
        suggestions: "Voorstelle",
        recycle_bin: "Asblik",
        developer_credit: "Ontwikkel deur ProspenTech.",
        all_rights_reserved: "Alle regte voorbehou.",
        
        // Language names
        english: "Engels",
        afrikaans: "Afrikaans",
        zulu: "Zoeloe",
        xhosa: "Xhosa",
        nso: "Noord-Sotho",
        sesotho: "Suid-Sotho",
        tswana: "Tswana",
        ndebele: "Ndebele",
        swati: "Swazi",
        venda: "Venda",
        tsonga: "Tsonga",
        
        // Dashboard sections
        quick_actions: "Vinnige Aksies",
        projects: "Projekte",
        updates: "Opdaterings",
        tasks: "Take",
        duties: "Prestasie Profiel",
        clients: "ProspenTech Projekte",
        meetings: "IT Vergadering Notules",
        banners: "E-pos Baniere",
        versions: "Weergawe Bord",
        admin: "Gebruiker Bestuur",
        welcome_message: "Welkom {name}, jy het {count} take hangende.",
        no_updates: "Nog geen opdaterings nie",
        post_update: "Plaas Opdatering",
        view_all: "Bekyk Alles",
        
        // Project related
        project_name: "Projek Naam",
        project_lead: "Projek Leier",
        project_status: "Status",
        project_type: "Tipe",
        start_date: "Begindatum",
        due_date: "Sperdatum",
        description: "Beskrywing",
        team_members: "Spanlede",
        tasks: "Take",
        budget: "Begroting",
        notes: "Notas",
        add_project: "Voeg Projek By",
        edit_project: "Wysig Projek",
        delete_project: "Verwyder Projek",
        confirm_delete: "Bevestig Verwydering",
        
        // Task related
        task_title: "Taak Titel",
        assigned_to: "Toegewys aan",
        priority: "Prioriteit",
        due_date: "Sperdatum",
        status: "Status",
        add_task: "Voeg Taak By",
        edit_task: "Wysig Taak",
        delete_task: "Verwyder Taak",
        mark_complete: "Merk as Voltooid",
        
        // Priority levels
        urgent: "Dringend",
        high: "Hoog",
        medium: "Medium",
        low: "Laag",
        normal: "Normaal",
        important: "Belangrik",
        
        // Status
        in_progress: "Aan die Gang",
        completed: "Voltooid",
        pending: "Hangende",
        on_hold: "In Wagtende",
        cancelled: "Gekanselleer",
        active: "Aktief",
        inactive: "Onaktief",
        
        // Clocking
        clock_in: "KLOK IN",
        clock_out: "KLOK UIT",
        clocked_in: "Ingeteken",
        clocked_out: "Uitgeteken",
        on_time: "Betyds",
        late: "Laat",
        early: "Vroeg",
        hours_worked: "Ure Gewerk",
        
        // Statistics
        total_projects: "Totale Projekte",
        total_tasks: "Totale Take",
        total_updates: "Totale Opdaterings",
        total_users: "Totale Gebruikers",
        active_users: "Aktiewe Gebruikers",
        overdue_tasks: "Agterstallige Take",
        completion_rate: "Voltooiingskoers",
        
        // Buttons
        save: "Stoor",
        cancel: "Kanselleer",
        delete: "Verwyder",
        edit: "Wysig",
        add: "Voeg By",
        close: "Maak Toe",
        confirm: "Bevestig",
        back: "Terug",
        
        // Messages
        success: "Sukses",
        error: "Fout",
        warning: "Waarskuwing",
        info: "Inligting",
        loading: "Laai...",
        no_data: "Geen data beskikbaar nie",
        are_you_sure: "Is jy seker?",
        action_cannot_be_undone: "Hierdie aksie kan nie ongedaan gemaak word nie.",
        
        // Time
        today: "Vandag",
        this_week: "Hierdie Week",
        this_month: "Hierdie Maand",
        this_year: "Hierdie Jaar",
        days_remaining: "Dae Oor",
        overdue: "Agterstallig",
        due_today: "Vandag Sperdatum!",
        
        // User roles
        administrator: "Administrateur",
        team_member: "Spanlid",
        project_lead: "Projek Leier",
        
        // Features
        feature_projects: "Volg alle IT en ontwerp projekte",
        feature_tasks: "Bestuur individuele take en opdragte",
        feature_updates: "Plaas en bekyk span opdaterings",
        feature_duties: "Definieer span rolle en verantwoordelikhede",
        feature_kpis: "Volg sleutel prestasie aanwysers",
        feature_clients: "Bestuur kliënt projek vereistes",
        feature_meetings: "Dokumenteer IT vergadering notules",
        feature_banners: "Volg e-pos banier toewysings",
        feature_versions: "Beplan kenmerk vrystellings",
        feature_stats: "Bekyk bywoning en stelsel analise",
        feature_tech_news: "Bly op hoogte van tegnologie neigings",
        view_projects: "Bekyk Projekte",
        view_tasks: "Bekyk Take",
        view_updates: "Bekyk Opdaterings",
        view_all_updates: "Bekyk Alle Opdaterings",
        nav_laptops: "Skootrekenaars",
        attendance_leave: "Bywoning & Verlof",
        performance_tracker: "Prestasie Opgaarder",
        nav_settings: "Instellings",
        chat_support: "Klet Ondersteuning",
        welcome_title: "Welkom!",
        section_updates: "Opdaterings",
        recent_activity: "Onlangse Aktiwiteit Tydlyn (Laaste 7 Dae)",
        add_task: "VOEG TAAK BY",
        leave: "VERLOF"
    },
    
    zu: {
        // Application
        app_title: "I-PROSPEN HUB",
        app_subtitle: "I-IT & Design Landelayo Yokulandelela Iphrojekthi 2026",
        logged_in_as: "Ungene ngokuthi:",
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        profile: "IPHROFILI",
        logout: "PHUMA",
        
        // Footer Navigation
        tech_news: "Izindaba Zobuchwepheshe",
        statistics: "Izibalo",
        settings: "Izilungiselelo",
        suggestions: "Iziphakamiso",
        recycle_bin: "Umgqomo Wokulahla",
        developer_credit: "Ithuthukiswe yi-ProspenTech.",
        all_rights_reserved: "Wonke amalungelo agodliwe.",
        
        // Language names
        english: "IsiNgisi",
        afrikaans: "IsiBhunu",
        zulu: "IsiZulu",
        xhosa: "IsiXhosa",
        nso: "IsiPedi",
        sesotho: "IsiSuthu",
        tswana: "IsiTswana",
        ndebele: "IsiNdebele",
        swati: "IsiSwati",
        venda: "IsiVenda",
        tsonga: "IsiTsonga",
        
        // Dashboard sections
        quick_actions: "Izenzo Ezisheshayo",
        projects: "Amaphrojekthi",
        updates: "Izibuyekezo",
        tasks: "Imisebenzi",
        duties: "Iphrofayela Yokusebenza",
        clients: "Amaphrojekthi we-ProspenTech",
        meetings: "Amaminithi Omhlangano we-IT",
        banners: "Amabhena we-imeyili",
        versions: "Ibhodhi Yenguqulo",
        admin: "Ukuphathwa Kwabasebenzisi",
        welcome_message: "Siyakwamukela {name}, unemisebenzi {count} esalindile.",
        no_updates: "Azikho izibuyekezo okwamanje",
        post_update: "Thumela Isibuyekezo",
        view_all: "Buka Konke",
        
        // Project related
        project_name: "Igama Lephrojekthi",
        project_lead: "Umholi Wephrojekthi",
        project_status: "Isimo",
        project_type: "Uhlobo",
        start_date: "Usuku Lokuqala",
        due_date: "Usuku Lokugcina",
        description: "Incazelo",
        team_members: "Amalungu Eqembu",
        tasks: "Imisebenzi",
        budget: "Isabelomali",
        notes: "Amanothi",
        add_project: "Engeza Iphrojekthi",
        edit_project: "Hlela Iphrojekthi",
        delete_project: "Susa Iphrojekthi",
        confirm_delete: "Qinisekisa Ukususa",
        
        // Task related
        task_title: "Isihloko Somsebenzi",
        assigned_to: "Kwabelwe Ku-",
        priority: "Ukubaluleka",
        due_date: "Usuku Lokugcina",
        status: "Isimo",
        add_task: "Engeza Umsebenzi",
        edit_task: "Hlela Umsebenzi",
        delete_task: "Susa Umsebenzi",
        mark_complete: "Maka Ukuqediwe",
        
        // Priority levels
        urgent: "Kuphuthumayo",
        high: "Phezulu",
        medium: "Maphakathi",
        low: "Phansi",
        normal: "Okujwayelekile",
        important: "Okubalulekile",
        
        // Status
        in_progress: "Iyaqhubeka",
        completed: "Iqediwe",
        pending: "Isalindile",
        on_hold: "Ibambekile",
        cancelled: "Ikhanseliwe",
        active: "Iyasebenza",
        inactive: "Ayisebenzi",
        
        // Clocking
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        clocked_in: "Ungene Isikhathi",
        clocked_out: "Uphumile Isikhathi",
        on_time: "Ngesikhathi",
        late: "Sekwephuzile",
        early: "Kusekuseni",
        hours_worked: "Amahora Asetshenziwe",
        
        // Statistics
        total_projects: "Amaphrojekthi Ewonke",
        total_tasks: "Imisebenzi Iyonke",
        total_updates: "Izibuyekezo Eziphelele",
        total_users: "Abasebenzisi Abaphelele",
        active_users: "Abasebenzisi Abasebenzayo",
        overdue_tasks: "Imisebenzi Esephuzile",
        completion_rate: "Izinga Lokuqeda",
        
        // Buttons
        save: "Londoloza",
        cancel: "Khansela",
        delete: "Susa",
        edit: "Hlela",
        add: "Engeza",
        close: "Vala",
        confirm: "Qinisekisa",
        back: "Emuva",
        
        // Messages
        success: "Iphumelele",
        error: "Iphutha",
        warning: "Isexwayiso",
        info: "Ulwazi",
        loading: "Iyalayisha...",
        no_data: "Alukho ulwazi olutholakalayo",
        are_you_sure: "Uqinisekile?",
        action_cannot_be_undone: "Lesi senzo asikwazi ukuhlehliswa.",
        
        // Time
        today: "Namuhla",
        this_week: "Kuleli sonto",
        this_month: "Kule nyanga",
        this_year: "Kulo nyaka",
        days_remaining: "Izinsuku Ezisele",
        overdue: "Isephuzile",
        due_today: "Iphetha Namuhla!",
        
        // User roles
        administrator: "Umphathi",
        team_member: "Ilungu Leqembu",
        project_lead: "Umholi Wephrojekthi",
        
        // Features
        feature_projects: "Landelela wonke amaphrojekthi we-IT nokwakha",
        feature_tasks: "Phatha imisebenzi ngayinye nezabelo",
        feature_updates: "Thumela futhi ubuke izibuyekezo zethimba",
        feature_duties: "Chaza izindima nezibopho zethimba",
        feature_kpis: "Landelela izinkomba zokusebenza ezibalulekile",
        feature_clients: "Phatha izidingo zamaphrojekthi wamakhasimende",
        feature_meetings: "Bhala phansi amaminithi emihlangano ye-IT",
        feature_banners: "Landelela izabelo zamabhena e-imeyili",
        feature_versions: "Hlela ukukhishwa kwezici",
        feature_stats: "Buka ukuya kanye nokuhlaziywa kwesistimu",
        feature_tech_news: "Hlala ubuke izitayela zobuchwepheshe",
        view_projects: "Buka Amaphrojekthi",
        view_tasks: "Buka Imisebenzi",
        view_updates: "Buka Izibuyekezo",
        view_all_updates: "Buka Zonke Izibuyekezo",
        nav_laptops: "Amalaphu",
        attendance_leave: "Ukuphila & Ikhefu",
        performance_tracker: "Ukulandela Ukusebenza",
        nav_settings: "Izilungiselelo",
        chat_support: "Usizo Lokukhuluma",
        welcome_title: "Wamukelekile!",
        section_updates: "Izibuyekezo",
        recent_activity: "Umlando Wemisebenzi Yamuva (Izinsuku Eziyi-7)",
        add_task: "ENGEZA UMSEBENZI",
        leave: "IKHEFU"
    },
    
    xh: {
        // Application
        app_title: "I-PROSPEN HUB",
        app_subtitle: "I-IT & Design Yokulandelela Iphrojekthi Emanyanisiweyo 2026",
        logged_in_as: "Ungene njengo:",
        clock_in: "NGENA IXESHA",
        clock_out: "PHUMA IXESHA",
        profile: "IPROFILE",
        logout: "PHUMA",
        
        // Footer Navigation
        tech_news: "Iindaba Zobuchwepheshe",
        statistics: "Iinkcukacha-manani",
        settings: "Useto",
        suggestions: "Iingcebiso",
        recycle_bin: "Umgqomo Wokulahla",
        developer_credit: "Iphuhliswe yi-ProspenTech.",
        all_rights_reserved: "Onke amalungelo agciniwe.",
        
        // Language names
        english: "IsiNgesi",
        afrikaans: "IsiBhulu",
        zulu: "IsiZulu",
        xhosa: "IsiXhosa",
        nso: "IsiPedi",
        sesotho: "IsiSuthu",
        tswana: "IsiTswana",
        ndebele: "IsiNdebele",
        swati: "IsiSwati",
        venda: "IsiVenda",
        tsonga: "IsiTsonga",
        
        // Dashboard sections
        quick_actions: "Izenzo Ezikhawulezileyo",
        projects: "Iiprojekthi",
        updates: "Uhlaziyo",
        tasks: "Imisebenzi",
        duties: "Iprofayile Yokusebenza",
        clients: "Iiprojekthi ze-ProspenTech",
        meetings: "Iimitshuzo Zentlanganiso ye-IT",
        banners: "Iibhena ze-imeyili",
        versions: "Ibhodi Yoguculo",
        admin: "Ulawulo Lwabasebenzisi",
        welcome_message: "Wamkelekile {name}, unemisebenzi {count} elindileyo.",
        no_updates: "Akukho hlaziyo okwangoku",
        post_update: "Thumela Uhlaziyo",
        view_all: "Jonga Zonke",
        
        // Project related
        project_name: "Igama Leprojekthi",
        project_lead: "UMkhokheli weProjekthi",
        project_status: "Isimo",
        project_type: "Uhlobo",
        start_date: "Umhla Wokuqala",
        due_date: "Umhla Wokugqibela",
        description: "Inkcazo",
        team_members: "Amalungu Eqela",
        tasks: "Imisebenzi",
        budget: "Uhlahlo lwabiwo-mali",
        notes: "Amanqaku",
        add_project: "Yongeza Iprojekthi",
        edit_project: "Hlela Iprojekthi",
        delete_project: "Cima Iprojekthi",
        confirm_delete: "Qinisekisa Ukucima",
        
        // Task related
        task_title: "Isihloko Somsebenzi",
        assigned_to: "Yabelwe Ku-",
        priority: "Ukubaluleka",
        due_date: "Umhla Wokugqibela",
        status: "Isimo",
        add_task: "Yongeza Umsebenzi",
        edit_task: "Hlela Umsebenzi",
        delete_task: "Cima Umsebenzi",
        mark_complete: "Phawula Njengogqityiweyo",
        
        // Priority levels
        urgent: "Ingxamisekile",
        high: "Phezulu",
        medium: "Phakathi",
        low: "Phantsi",
        normal: "Okuqhelekileyo",
        important: "Kubalulekile",
        
        // Status
        in_progress: "Iyaqhuba",
        completed: "Igqityiwe",
        pending: "Ilindile",
        on_hold: "Ibambekile",
        cancelled: "Irhoxisiwe",
        active: "Iyasebenza",
        inactive: "Ayisebenzi",
        
        // Clocking
        clock_in: "NGENA IXESHA",
        clock_out: "PHUMA IXESHA",
        clocked_in: "Ungenile Ixesha",
        clocked_out: "Uphumile Ixesha",
        on_time: "Ngexesha",
        late: "Lishiyile",
        early: "Kusekuseni",
        hours_worked: "Iiyure Ezisetyenzisiweyo",
        
        // Statistics
        total_projects: "Iiprojekthi Zizonke",
        total_tasks: "Imisebenzi Iyonke",
        total_updates: "Uhlaziyo Luphela",
        total_users: "Abasebenzisi Bonke",
        active_users: "Abasebenzisi Abasebenzayo",
        overdue_tasks: "Imisebenzi Elihle Ixesha",
        completion_rate: "Izinga Lokugqiba",
        
        // Buttons
        save: "Gcina",
        cancel: "Rhoxisa",
        delete: "Cima",
        edit: "Hlela",
        add: "Yongeza",
        close: "Vala",
        confirm: "Qinisekisa",
        back: "Buyela",
        
        // Messages
        success: "Impumelelo",
        error: "Impazamo",
        warning: "Isilumkiso",
        info: "Ulwazi",
        loading: "Iyalayisha...",
        no_data: "Akukho datha ifumanekayo",
        are_you_sure: "Uqinisekile?",
        action_cannot_be_undone: "Esi senzo asinakurhoxiswa.",
        
        // Time
        today: "Namhlanje",
        this_week: "Kule veki",
        this_month: "Kule nyanga",
        this_year: "Kulo nyaka",
        days_remaining: "Iintsuku Eziseleyo",
        overdue: "Ilihle Ixesha",
        due_today: "Iphetha Namhlanje!",
        
        // User roles
        administrator: "Umlawuli",
        team_member: "Ilungu Leqela",
        project_lead: "UMkhokheli weProjekthi",
        
        // Features
        feature_projects: "Landelela zonke iiprojekthi ze-IT noyilo",
        feature_tasks: "Lawula imisebenzi kunye nezabelo",
        feature_updates: "Thumela kwaye ujonge uhlaziyo lweqela",
        feature_duties: "Chaza iindima kunye noxanduva lweqela",
        feature_kpis: "Landelela izikhombisi zokusebenza eziphambili",
        feature_clients: "Lawula iimfuno zeprojekthi yomthengi",
        feature_meetings: "Bhala iimitshuzo zentlanganiso ye-IT",
        feature_banners: "Landelela izabelo zebhena ye-imeyili",
        feature_versions: "Cwangcisa ukukhutshwa kweempawu",
        feature_stats: "Jonga ukuya kunye nohlalutyo lwenkqubo",
        feature_tech_news: "Hlala uhlaziyekile ngeendlela zobuchwepheshe",
        view_projects: "Jonga Iiprojekthi",
        view_tasks: "Jonga Imisebenzi",
        view_updates: "Jonga Uhlaziyo",
        view_all_updates: "Jonga Lonke Uhlaziyo",
        nav_laptops: "Iilaptop",
        attendance_leave: "Ukuphazamiseka & Imvume",
        performance_tracker: "Ukulandela Ukusebenza",
        nav_settings: "Useto",
        chat_support: "Uncedo Lokuthetha",
        welcome_title: "Wamkelekile!",
        section_updates: "Uhlaziyo",
        recent_activity: "Umlando Wemisebenzi Yamva (Iintsuku Ezi-7)",
        add_task: "YONGEZA UMSEBENZI",
        leave: "IMVUME"
    },
    
    nso: {
        // Application
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Morero wa Phedišišo wo o Kopantšwego 2026",
        logged_in_as: "O tsene bjalo ka:",
        clock_in: "TSENA NAKO",
        clock_out: "ETŠWA NAKONG",
        profile: "POROFELE",
        logout: "TSENYA",
        
        // Footer Navigation
        tech_news: "Ditaba tša Theknolotši",
        statistics: "Dipalopalo",
        settings: "Dithulaganyo",
        suggestions: "Ditšhišinyo",
        recycle_bin: "Mokotlana wa go Lahlwa",
        developer_credit: "E hlabilwe ke ProspenTech.",
        all_rights_reserved: "Ditokelo ka moka di bolokilwe.",
        
        // Language names
        english: "Seisimane",
        afrikaans: "Seafrikanse",
        zulu: "Sezulu",
        xhosa: "Sexhosa",
        nso: "Sepedi",
        sesotho: "Sesotho",
        tswana: "Setswana",
        ndebele: "Sendebele",
        swati: "Seswati",
        venda: "Tshivenda",
        tsonga: "Xitsonga",
        
        // Dashboard sections
        quick_actions: "Ditiro tša Ka Potlako",
        projects: "Merero",
        updates: "Dintlafatšo",
        tasks: "Mešomo",
        duties: "Porofaele ya Tšhomo",
        clients: "Merero ya ProspenTech",
        meetings: "Ditshupetšo tša Kopano ya IT",
        banners: "Dibannara tša Imeile",
        versions: "Boto ya Diphetolelo",
        admin: "Taolo ya Bašomiši",
        welcome_message: "Re a go amogela {name}, o na le mešomo {count} e e letilego.",
        no_updates: "Ga go dintlafatšo tše mpsha",
        post_update: "Phasalatša Tlhatlošo",
        view_all: "Bona Ka Moka",
        
        // Project related
        project_name: "Leina la Morero",
        project_lead: "Moetapele wa Morero",
        project_status: "Maemo",
        project_type: "Mohuta",
        start_date: "Letšatšikgwedi la go Thoma",
        due_date: "Letšatšikgwedi la go Fetša",
        description: "Tlhalošo",
        team_members: "Ditho tša Sehlopha",
        tasks: "Mešomo",
        budget: "Tekanyetšo ya Tšhelete",
        notes: "Dintlha",
        add_project: "Lokela Morero",
        edit_project: "Fetola Morero",
        delete_project: "Phumula Morero",
        confirm_delete: "Tiiša go Phumula",
        
        // Task related
        task_title: "Thaetlele ya Mošomo",
        assigned_to: "Abelwa Go",
        priority: "Bohlokwa",
        due_date: "Letšatšikgwedi la go Fetša",
        status: "Maemo",
        add_task: "Lokela Mošomo",
        edit_task: "Fetola Mošomo",
        delete_task: "Phumula Mošomo",
        mark_complete: "Šupa e Phethilwe",
        
        // Priority levels
        urgent: "Ka pela",
        high: "Godimo",
        medium: "Magareng",
        low: "Tlase",
        normal: "Ka tlwaelo",
        important: "Bohlokwa",
        
        // Status
        in_progress: "E a tšwela pele",
        completed: "E phethilwe",
        pending: "E letile",
        on_hold: "E emisitšwe",
        cancelled: "E hlakantšwe",
        active: "E šoma",
        inactive: "Ga e šome",
        
        // Clocking
        clock_in: "TSENA NAKO",
        clock_out: "ETŠWA NAKONG",
        clocked_in: "O tsene nako",
        clocked_out: "O tšwele nakong",
        on_time: "Ka nako",
        late: "O diefile",
        early: "Pele ga nako",
        hours_worked: "Diiri tšeo di Šomilwego",
        
        // Statistics
        total_projects: "Dipalopalo tša Merero",
        total_tasks: "Dipalopalo tša Mešomo",
        total_updates: "Dipalopalo tša Dintlafatšo",
        total_users: "Dipalopalo tša Bašomiši",
        active_users: "Bašomiši bao ba Šomago",
        overdue_tasks: "Mešomo yeo e Fetilego Nako",
        completion_rate: "Sekelo sa go Phetha",
        
        // Buttons
        save: "Boloka",
        cancel: "Hlakantšha",
        delete: "Phumula",
        edit: "Fetola",
        add: "Lokela",
        close: "Tswalela",
        confirm: "Tiiša",
        back: "Morago",
        
        // Messages
        success: "Katlego",
        error: "Phosho",
        warning: "Temošo",
        info: "Tshedimošo",
        loading: "E a laiša...",
        no_data: "Ga go data ye e hweditšwego",
        are_you_sure: "Na o tiile?",
        action_cannot_be_undone: "Tiro ye e ka se khutlišwe morago.",
        
        // Time
        today: "Lehono",
        this_week: "Bele ye",
        this_month: "Kgwedi ye",
        this_year: "Ngwaga wo",
        days_remaining: "Matšatši a a Šetšego",
        overdue: "E fetile nako",
        due_today: "E fela Lehono!",
        
        // User roles
        administrator: "Molaodi",
        team_member: "Leloko la Sehlopha",
        project_lead: "Moetapele wa Morero",
        
        // Features
        feature_projects: "Latela merero yohle ya IT le boqapi",
        feature_tasks: "Laola mešomo le dikabelo ka boyena",
        feature_updates: "Romela le go lebelela dintlafatšo tša sehlopha",
        feature_duties: "Hlaloša dikarolo le maikarabelo a sehlopha",
        feature_kpis: "Latela matšhwao a bohlokwa a tšhomo",
        feature_clients: "Laola dinyakwa tša morero wa moreki",
        feature_meetings: "Ngwala ditshupetšo tša kopano ya IT",
        feature_banners: "Latela dikabelo tša dibannara tša imeile",
        feature_versions: "Rera go lokollwa ga dikarolo",
        feature_stats: "Lebelela go ba gona le tshekatsheko ya sisteme",
        feature_tech_news: "Dula o hlokometše mekgwa ya theknolotši",
        view_projects: "Lebelela Diporojeke",
        view_tasks: "Lebelela Mešomo",
        view_updates: "Lebelela Dikgatišo",
        view_all_updates: "Lebelela Dikgatišo Tšohle",
        nav_laptops: "Dikhomphutha",
        attendance_leave: "Go tla le Go hloka",
        performance_tracker: "Molaodi wa Tiro",
        nav_settings: "Dipeakanyo",
        chat_support: "Thušo ya go bua",
        welcome_title: "Amogela!",
        section_updates: "Dikgatišo",
        recent_activity: "Lenaneo la Mešomo ya Bjale (Matsatsi a 7)",
        add_task: "OKETŠA MOŠOMO",
        leave: "GO HLOKA"
    },
    
    st: {
        // Application
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Morero o Kopanetsoeng wa Phedišišo 2026",
        logged_in_as: "U kene joalo ka:",
        clock_in: "KENA NAKO",
        clock_out: "TSWA NAKONG",
        profile: "PORAEFELE",
        logout: "TSENYA",
        
        // Footer Navigation
        tech_news: "Ditaba tsa Theknoloji",
        statistics: "Dipalopalo",
        settings: "Dihlophiso",
        suggestions: "Ditlhahiso",
        recycle_bin: "Mokotlana wa ho Lahla",
        developer_credit: "E ntlafalitsoe ke ProspenTech.",
        all_rights_reserved: "Litokelo tsohle li bolokiloe.",
        
        // Language names
        english: "Senyesemane",
        afrikaans: "Seafrikanse",
        zulu: "Sezulu",
        xhosa: "Sexhosa",
        nso: "Sepedi",
        sesotho: "Sesotho",
        tswana: "Setswana",
        ndebele: "Sendebele",
        swati: "Seswati",
        venda: "Tshivenda",
        tsonga: "Xitsonga",
        
        // Dashboard sections
        quick_actions: "Diketso tse Potlakileng",
        projects: "Merero",
        updates: "Lintlafatso",
        tasks: "Mesebetsi",
        duties: "Profaele ya Ts'ebetso",
        clients: "Merero ea ProspenTech",
        meetings: "Lintlha tsa Kopano ea IT",
        banners: "Libannara tsa Imeile",
        versions: "Boto ea Diphetolelo",
        admin: "Taolo ea Basebelisi",
        welcome_message: "Rea u amohela {name}, u na le mesebetsi {count} e emeng.",
        no_updates: "Ha ho lintlafatso tse ncha",
        post_update: "Romela Ntlafatso",
        view_all: "Bona Tsohle",
        
        // Project related
        project_name: "Lebitso la Morero",
        project_lead: "Moeta-pele oa Morero",
        project_status: "Boemo",
        project_type: "Mofuta",
        start_date: "Letsatsi la ho Qala",
        due_date: "Letsatsi la ho Fella",
        description: "Tlhaloso",
        team_members: "Litho tsa Sehlopha",
        tasks: "Mesebetsi",
        budget: "Tekanyetso ea Chelete",
        notes: "Lintlha",
        add_project: "Kenya Morero",
        edit_project: "Fetola Morero",
        delete_project: "Hlakola Morero",
        confirm_delete: "Netefatsa ho Hlakola",
        
        // Task related
        task_title: "Sehlooho sa Mosebetsi",
        assigned_to: "Abeloa ho",
        priority: "Bohlokoa",
        due_date: "Letsatsi la ho Fella",
        status: "Boemo",
        add_task: "Kenya Mosebetsi",
        edit_task: "Fetola Mosebetsi",
        delete_task: "Hlakola Mosebetsi",
        mark_complete: "Tšoaea e Phethiloe",
        
        // Priority levels
        urgent: "Potlako",
        high: "Phahameng",
        medium: "Bohareng",
        low: "Tlase",
        normal: "Tloaelehileng",
        important: "Bohlokoa",
        
        // Status
        in_progress: "E Tsoela Pele",
        completed: "E Phethiloe",
        pending: "E Emetse",
        on_hold: "E Emisitsoe",
        cancelled: "E Hlakotsoe",
        active: "E Sebetsa",
        inactive: "Ha e Sebetsi",
        
        // Clocking
        clock_in: "KENA NAKO",
        clock_out: "TSWA NAKONG",
        clocked_in: "O kene nako",
        clocked_out: "O tsoile nakong",
        on_time: "Ka nako",
        late: "O siiloe ke nako",
        early: "Pejana",
        hours_worked: "Lihora tse Sebelitsoeng",
        
        // Statistics
        total_projects: "Kakaretso ea Merero",
        total_tasks: "Kakaretso ea Mesebetsi",
        total_updates: "Kakaretso ea Lintlafatso",
        total_users: "Kakaretso ea Basebelisi",
        active_users: "Basebelisi ba Sebetsang",
        overdue_tasks: "Mesebetsi e Fetileng Nako",
        completion_rate: "Sekhahla sa ho Phetha",
        
        // Buttons
        save: "Boloka",
        cancel: "Hlakola",
        delete: "Hlakola",
        edit: "Fetola",
        add: "Kenya",
        close: "Koala",
        confirm: "Netefatsa",
        back: "Khutlela",
        
        // Messages
        success: "Katleho",
        error: "Phoso",
        warning: "Tlhokomeliso",
        info: "Tlhahisoleseling",
        loading: "E kenya...",
        no_data: "Ha ho data e fumanehang",
        are_you_sure: "Na u na le bonnete?",
        action_cannot_be_undone: "Khato ena e ke ke ea khutlisoa morao.",
        
        // Time
        today: "Kajeno",
        this_week: "Bekeng ena",
        this_month: "Khoeling ena",
        this_year: "Selemong sena",
        days_remaining: "Matsatsi a Setseng",
        overdue: "E fetile nako",
        due_today: "E fella Kajeno!",
        
        // User roles
        administrator: "Molaoli",
        team_member: "Setho sa Sehlopha",
        project_lead: "Moeta-pele oa Morero",
        
        // Features
        feature_projects: "Lata merero eohle ea IT le boqapi",
        feature_tasks: "Laola mesebetsi le likabelo ka bonngoe",
        feature_updates: "Romela le ho sheba lintlafatso tsa sehlopha",
        feature_duties: "Hlalosa likarolo le boikarabello ba sehlopha",
        feature_kpis: "Lata matšoao a bohlokoa a ts'ebetso",
        feature_clients: "Laola litlhoko tsa morero oa moreki",
        feature_meetings: "Ngola lintlha tsa kopano ea IT",
        feature_banners: "Lata likabelo tsa libannara tsa imeile",
        feature_versions: "Rera ho lokolloa ha likarolo",
        feature_stats: "Sheba boteng le tlhahlobo ea sistimi",
        feature_tech_news: "Lula u hlokometse mekhoa ea theknoloji",
        view_projects: "Sheba Merero",
        view_tasks: "Sheba Mesebetsi",
        view_updates: "Sheba Diphetolo",
        view_all_updates: "Sheba Diphetolo Tsohle",
        nav_laptops: "Dikhomphutha",
        attendance_leave: "Ho tla le Ho hloka",
        performance_tracker: "Motheo wa Mosebetsi",
        nav_settings: "Dipeakanyo",
        chat_support: "Thuso ya Puisano",
        welcome_title: "Amoheha!",
        section_updates: "Diphetolo",
        recent_activity: "Lenaneo la Mesebetsi ya Morao (Matsatsi a 7)",
        add_task: "KENYA MOSEBETSI",
        leave: "HO HLOKA"
    },
    
    tn: {
        // Application
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Morero o Kopanetsweng wa Phedišišo 2026",
        logged_in_as: "O tsene jalo ka:",
        clock_in: "TSENA NAKO",
        clock_out: "TSWA NAKONG",
        profile: "PORAEFELE",
        logout: "TSENYA",
        
        // Footer Navigation
        tech_news: "Ditaba tsa Theknolotši",
        statistics: "Dipalopalo",
        settings: "Dithulaganyo",
        suggestions: "Ditshitshinyo",
        recycle_bin: "Mokotlana wa go Lahlwa",
        developer_credit: "E tlhamilwe ke ProspenTech.",
        all_rights_reserved: "Ditshwanelo tsotlhe di bolokilwe.",
        
        // Language names
        english: "Seisimane",
        afrikaans: "Seafrikanse",
        zulu: "Sezulu",
        xhosa: "Sexhosa",
        nso: "Sepedi",
        sesotho: "Sesotho",
        tswana: "Setswana",
        ndebele: "Sendebele",
        swati: "Seswati",
        venda: "Tshivenda",
        tsonga: "Xitsonga",
        
        // Dashboard sections
        quick_actions: "Ditiro tsa ka Bonako",
        projects: "Merero",
        updates: "Dintlafatso",
        tasks: "Ditiro",
        duties: "Porofaete ya Tiragatso",
        clients: "Merero ya ProspenTech",
        meetings: "Ditshupetso tsa Kopano ya IT",
        banners: "Dibannara tsa Imeile",
        versions: "Boto ya Diphetolelo",
        admin: "Taolo ya Badirisi",
        welcome_message: "Re a go amogela {name}, o na le ditiro {count} tse di letileng.",
        no_updates: "Ga go dintlafatso tse dišwa",
        post_update: "Phasalatsa Tlhatloso",
        view_all: "Bona Tsotlhe",
        
        // Project related
        project_name: "Leina la Morero",
        project_lead: "Moeteledipele wa Morero",
        project_status: "Boemo",
        project_type: "Mofuta",
        start_date: "Letlha la go Simolola",
        due_date: "Letlha la go Fetsa",
        description: "Tlhaloso",
        team_members: "Ditho tsa Setlhopha",
        tasks: "Ditiro",
        budget: "Tekanyetso ya Madi",
        notes: "Dintlha",
        add_project: "Tsenya Morero",
        edit_project: "Fetola Morero",
        delete_project: "Phimola Morero",
        confirm_delete: "Netefatsa go Phimola",
        
        // Task related
        task_title: "Setlhogo sa Tiro",
        assigned_to: "Abetswe go",
        priority: "Bokao",
        due_date: "Letlha la go Fetsa",
        status: "Boemo",
        add_task: "Tsenya Tiro",
        edit_task: "Fetola Tiro",
        delete_task: "Phimola Tiro",
        mark_complete: "Tshwaya e Weditse",
        
        // Priority levels
        urgent: "Ka bonako",
        high: "Godimo",
        medium: "Magareng",
        low: "Tlase",
        normal: "Ka tlwaelo",
        important: "Botlhokwa",
        
        // Status
        in_progress: "E a tswelela",
        completed: "E weditse",
        pending: "E letile",
        on_hold: "E emisitswe",
        cancelled: "E emisitswe",
        active: "E a bereka",
        inactive: "Ga e bereke",
        
        // Clocking
        clock_in: "TSENA NAKO",
        clock_out: "TSWA NAKONG",
        clocked_in: "O tsene nako",
        clocked_out: "O tswile nakong",
        on_time: "Ka nako",
        late: "O diegile",
        early: "Pele ga nako",
        hours_worked: "Diura tse di Berekilweng",
        
        // Statistics
        total_projects: "Palo ya Merero",
        total_tasks: "Palo ya Ditiro",
        total_updates: "Palo ya Dintlafatso",
        total_users: "Palo ya Badirisi",
        active_users: "Badirisi ba ba Berekileng",
        overdue_tasks: "Ditiro tse di Fetileng Nako",
        completion_rate: "Sekelo sa go Fetsa",
        
        // Buttons
        save: "Boloka",
        cancel: "Kganela",
        delete: "Phimola",
        edit: "Fetola",
        add: "Tsenya",
        close: "Tswala",
        confirm: "Netefatsa",
        back: "Morago",
        
        // Messages
        success: "Katlego",
        error: "Phoso",
        warning: "Tlhagiso",
        info: "Tshedimosetso",
        loading: "E a laela...",
        no_data: "Ga go data e e fitlhegetseng",
        are_you_sure: "A o na le bonnete?",
        action_cannot_be_undone: "Tiro eno e ka se busediwe morago.",
        
        // Time
        today: "Gompieno",
        this_week: "Beke eno",
        this_month: "Kgwedi eno",
        this_year: "Ngwaga ono",
        days_remaining: "Malatsi a a Setseng",
        overdue: "E fetile nako",
        due_today: "E fela Gompieno!",
        
        // User roles
        administrator: "Molaodi",
        team_member: "Leloko la Setlhopha",
        project_lead: "Moeteledipele wa Morero",
        
        // Features
        feature_projects: "Latela merero yotlhe ya IT le boqapi",
        feature_tasks: "Laola ditiro le dikabelo ka bonosi",
        feature_updates: "Romela le go leba dintlafatso tsa setlhopha",
        feature_duties: "Tlhalosa dikarolo le maikarabelo a setlhopha",
        feature_kpis: "Latela matshwao a botlhokwa a tiro",
        feature_clients: "Laola ditlhokego tsa morero wa moreki",
        feature_meetings: "Kwala ditshupetso tsa kopano ya IT",
        feature_banners: "Latela dikabelo tsa dibannara tsa imeile",
        feature_versions: "Rera go gololwa ga dikarolo",
        feature_stats: "Lebelela boteng le tshekatsheko ya sisteme",
        feature_tech_news: "Dula o lebeletse mekgwa ya thekenoloji",
        view_projects: "Bona Diprojeke",
        view_tasks: "Bona Mošomo",
        view_updates: "Bona Dikgatišo",
        view_all_updates: "Bona Dikgatišo Tsotlhe",
        nav_laptops: "Dikhomphutha",
        attendance_leave: "Go nna le Go tlhoka",
        performance_tracker: "Molebeledi wa Tiro",
        nav_settings: "Dipeelo",
        chat_support: "Thuso ya Puisano",
        welcome_title: "Amogela!",
        section_updates: "Dikgatišo",
        recent_activity: "Lenaneo la Mošomo wa Jaanong (Malatsi a 7)",
        add_task: "TSENYA MOŠOMO",
        leave: "GO TLHOKA"
    },
    
    nr: {
        // Application
        app_title: "I-PROSPEN HUB",
        app_subtitle: "I-IT & Design Yokulandelela Iphrojekthi Emanyanisiweyo 2026",
        logged_in_as: "Ungene njengo:",
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        profile: "IPHROFILI",
        logout: "PHUMA",
        
        // Footer Navigation
        tech_news: "Izindaba Zobuchwepheshe",
        statistics: "Izibalo",
        settings: "Izilungiselelo",
        suggestions: "Iziphakamiso",
        recycle_bin: "Umgqomo Wokulahla",
        developer_credit: "Yakhiwa yi-ProspenTech.",
        all_rights_reserved: "Wonke amalungelo agodliwe.",
        
        // Language names
        english: "IsiNgisi",
        afrikaans: "IsiBhunu",
        zulu: "IsiZulu",
        xhosa: "IsiXhosa",
        nso: "IsiPedi",
        sesotho: "IsiSuthu",
        tswana: "IsiTswana",
        ndebele: "IsiNdebele",
        swati: "IsiSwati",
        venda: "IsiVenda",
        tsonga: "IsiTsonga",
        
        // Dashboard sections
        quick_actions: "Izenzo Ezisheshayo",
        projects: "Amaphrojekthi",
        updates: "Izibuyekezo",
        tasks: "Imisebenzi",
        duties: "Iphrofayela Yokusebenza",
        clients: "Amaphrojekthi we-ProspenTech",
        meetings: "Amaminithi Omhlangano we-IT",
        banners: "Amabhena we-imeyili",
        versions: "Ibhodhi Yenguqulo",
        admin: "Ukuphathwa Kwabasebenzisi",
        welcome_message: "Siyakwamukela {name}, unemisebenzi {count} esalindile.",
        no_updates: "Azikho izibuyekezo okwamanje",
        post_update: "Thumela Isibuyekezo",
        view_all: "Buka Konke",
        
        // Project related
        project_name: "Igama Lephrojekthi",
        project_lead: "Umholi Wephrojekthi",
        project_status: "Isimo",
        project_type: "Uhlobo",
        start_date: "Usuku Lokuqala",
        due_date: "Usuku Lokugcina",
        description: "Incazelo",
        team_members: "Amalungu Eqembu",
        tasks: "Imisebenzi",
        budget: "Isabelomali",
        notes: "Amanothi",
        add_project: "Engeza Iphrojekthi",
        edit_project: "Hlela Iphrojekthi",
        delete_project: "Susa Iphrojekthi",
        confirm_delete: "Qinisekisa Ukususa",
        
        // Task related
        task_title: "Isihloko Somsebenzi",
        assigned_to: "Kwabelwe Ku-",
        priority: "Ukubaluleka",
        due_date: "Usuku Lokugcina",
        status: "Isimo",
        add_task: "Engeza Umsebenzi",
        edit_task: "Hlela Umsebenzi",
        delete_task: "Susa Umsebenzi",
        mark_complete: "Maka Ukuqediwe",
        
        // Priority levels
        urgent: "Kuphuthumayo",
        high: "Phezulu",
        medium: "Maphakathi",
        low: "Phansi",
        normal: "Okujwayelekile",
        important: "Okubalulekile",
        
        // Status
        in_progress: "Iyaqhubeka",
        completed: "Iqediwe",
        pending: "Isalindile",
        on_hold: "Ibambekile",
        cancelled: "Ikhanseliwe",
        active: "Iyasebenza",
        inactive: "Ayisebenzi",
        
        // Clocking
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        clocked_in: "Ungene Isikhathi",
        clocked_out: "Uphumile Isikhathi",
        on_time: "Ngesikhathi",
        late: "Sekwephuzile",
        early: "Kusekuseni",
        hours_worked: "Amahora Asetshenziwe",
        
        // Statistics
        total_projects: "Amaphrojekthi Ewonke",
        total_tasks: "Imisebenzi Iyonke",
        total_updates: "Izibuyekezo Eziphelele",
        total_users: "Abasebenzisi Abaphelele",
        active_users: "Abasebenzisi Abasebenzayo",
        overdue_tasks: "Imisebenzi Esephuzile",
        completion_rate: "Izinga Lokuqeda",
        
        // Buttons
        save: "Londoloza",
        cancel: "Khansela",
        delete: "Susa",
        edit: "Hlela",
        add: "Engeza",
        close: "Vala",
        confirm: "Qinisekisa",
        back: "Emuva",
        
        // Messages
        success: "Iphumelele",
        error: "Iphutha",
        warning: "Isexwayiso",
        info: "Ulwazi",
        loading: "Iyalayisha...",
        no_data: "Alukho ulwazi olutholakalayo",
        are_you_sure: "Uqinisekile?",
        action_cannot_be_undone: "Lesi senzo asikwazi ukuhlehliswa.",
        
        // Time
        today: "Namuhla",
        this_week: "Kuleli sonto",
        this_month: "Kule nyanga",
        this_year: "Kulo nyaka",
        days_remaining: "Izinsuku Ezisele",
        overdue: "Isephuzile",
        due_today: "Iphetha Namuhla!",
        
        // User roles
        administrator: "Umphathi",
        team_member: "Ilungu Leqembu",
        project_lead: "Umholi Wephrojekthi",
        
        // Features
        feature_projects: "Landelela wonke amaphrojekthi we-IT nokwakha",
        feature_tasks: "Phatha imisebenzi ngayinye nezabelo",
        feature_updates: "Thumela futhi ubuke izibuyekezo zethimba",
        feature_duties: "Chaza izindima nezibopho zethimba",
        feature_kpis: "Landelela izinkomba zokusebenza ezibalulekile",
        feature_clients: "Phatha izidingo zamaphrojekthi wamakhasimende",
        feature_meetings: "Bhala phansi amaminithi emihlangano ye-IT",
        feature_banners: "Landelela izabelo zamabhena e-imeyili",
        feature_versions: "Hlela ukukhishwa kwezici",
        feature_stats: "Buka ukuya kanye nokuhlaziywa kwesistimu",
        feature_tech_news: "Hlala ubuke izitayela zobuchwepheshe",
        view_projects: "Bona Iimphrojekthi",
        view_tasks: "Bona Imisebenzi",
        view_updates: "Bona Iilwazi",
        view_all_updates: "Bona Iilwazi Zonke",
        nav_laptops: "Amalaphu",
        attendance_leave: "Ukuphila & Ikhefu",
        performance_tracker: "Ukulandela Ukusebenza",
        nav_settings: "Izilungiselelo",
        chat_support: "Usizo Lokukhuluma",
        welcome_title: "Wamukelekile!",
        section_updates: "Iilwazi",
        recent_activity: "Umlando Wemisebenzi Yamuva (Iintsuku Eziyi-7)",
        add_task: "ENGEZA UMSEBENZI",
        leave: "IKHEFU"
    },
    
    ss: {
        // Application
        app_title: "I-PROSPEN HUB",
        app_subtitle: "I-IT & Design Yokulandzelela Iphrojekthi Emanyanisiweyo 2026",
        logged_in_as: "Ungene njengo:",
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        profile: "IPHROFILI",
        logout: "PHUMA",
        
        // Footer Navigation
        tech_news: "Tindzaba Tebuchwepheshe",
        statistics: "Tibalobalo",
        settings: "Tilungiselelo",
        suggestions: "Tiphakamiso",
        recycle_bin: "Umgomo Wekulahla",
        developer_credit: "Yakhiwe yi-ProspenTech.",
        all_rights_reserved: "Wonke emalungelo agodliwe.",
        
        // Language names
        english: "SíNgísi",
        afrikaans: "SíBhunu",
        zulu: "SíZulu",
        xhosa: "SíXhosa",
        nso: "SíPedi",
        sesotho: "SíSuthu",
        tswana: "SíTswana",
        ndebele: "SíNdebele",
        swati: "SíSwati",
        venda: "SíVenda",
        tsonga: "SíTsonga",
        
        // Dashboard sections
        quick_actions: "Tento Letisheshako",
        projects: "Emaphrojekthi",
        updates: "Tibuyekezo",
        tasks: "Imisebenti",
        duties: "Iphrofayili Yekusebenta",
        clients: "Emaphrojekthi e-ProspenTech",
        meetings: "Emaminithi Emhlangano we-IT",
        banners: "Emabhena e-imeyili",
        versions: "Ibhodhi Yenguqulo",
        admin: "Kuphathwa Kwabasebentisi",
        welcome_message: "Siyakwemukela {name}, unemisebenti {count} lelindzile.",
        no_updates: "Ayikho tibuyekezo okwamanje",
        post_update: "Thumela Sibuyekezo",
        view_all: "Buka Konkhe",
        
        // Project related
        project_name: "Ligama Lephrojekthi",
        project_lead: "Umholi Wephrojekthi",
        project_status: "Simo",
        project_type: "Luhlobo",
        start_date: "Lusuku Lwekuqala",
        due_date: "Lusuku Lokugcina",
        description: "Incazelo",
        team_members: "Emalunga Eqembu",
        tasks: "Imisebenti",
        budget: "Isabelomali",
        notes: "Emanothi",
        add_project: "Engeza Iphrojekthi",
        edit_project: "Hlela Iphrojekthi",
        delete_project: "Susa Iphrojekthi",
        confirm_delete: "Qinisekisa Kususa",
        
        // Task related
        task_title: "Sihloko Somsebenti",
        assigned_to: "Kwabelwe Ku-",
        priority: "Kubaluleka",
        due_date: "Lusuku Lokugcina",
        status: "Simo",
        add_task: "Engeza Umsebenti",
        edit_task: "Hlela Umsebenti",
        delete_task: "Susa Umsebenti",
        mark_complete: "Maka Kuphelele",
        
        // Priority levels
        urgent: "Kusheshe",
        high: "Phezulu",
        medium: "Maphakatsi",
        low: "Phansi",
        normal: "Lokujwayelekile",
        important: "Kubalulekile",
        
        // Status
        in_progress: "Kuyachubeka",
        completed: "Kuphelele",
        pending: "Kulindzile",
        on_hold: "Kubambekile",
        cancelled: "Kukhanseliwe",
        active: "Kuyasebenta",
        inactive: "Akusebenti",
        
        // Clocking
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        clocked_in: "Ungene Isikhatsi",
        clocked_out: "Uphumile Isikhatsi",
        on_time: "Ngesikhatsi",
        late: "Sekwephuzile",
        early: "Kusekuseni",
        hours_worked: "Emahora Asetjentiswe",
        
        // Statistics
        total_projects: "Emaphrojekthi Onkhe",
        total_tasks: "Imisebenti Yonkhe",
        total_updates: "Tibuyekezo Letiphelele",
        total_users: "Basebentisi B bonkhe",
        active_users: "Basebentisi Labasebentako",
        overdue_tasks: "Imisebenti Lesephuzile",
        completion_rate: "Izinga Lekuphela",
        
        // Buttons
        save: "Londvolota",
        cancel: "Khansela",
        delete: "Susa",
        edit: "Hlela",
        add: "Engeza",
        close: "Vala",
        confirm: "Qinisekisa",
        back: "Emuva",
        
        // Messages
        success: "Kuphumelele",
        error: "Liphutsa",
        warning: "Sexwayiso",
        info: "Lwati",
        loading: "Layisha...",
        no_data: "Ayikho data letfolakalako",
        are_you_sure: "Uqinisekile?",
        action_cannot_be_undone: "Lesento asikwati kuhlehliswa.",
        
        // Time
        today: "Lamuhla",
        this_week: "Leliviki",
        this_month: "Lenyanga",
        this_year: "Lonyaka",
        days_remaining: "Malanga Lasele",
        overdue: "Sephuzile",
        due_today: "Kuphela Lamuhla!",
        
        // User roles
        administrator: "Umphatsi",
        team_member: "Lilunga Lelicembu",
        project_lead: "Umholi Wephrojekthi",
        
        // Features
        feature_projects: "Landzelela wonkhe emaphrojekthi e-IT nekuklama",
        feature_tasks: "Phatha imisebenti nekwabelwa ngakunye",
        feature_updates: "Thumela futsi ubuke tibuyekezo telicembu",
        feature_duties: "Chaza tindzima netibopho telicembu",
        feature_kpis: "Landzelela tinkhomba tekusebenta letibalulekile",
        feature_clients: "Phatha tidzingo temaphrojekthi emakhasimende",
        feature_meetings: "Bhala phansi emaminithi emhlangano we-IT",
        feature_banners: "Landzelela kwabelwa kwemabhena e-imeyili",
        feature_versions: "Hlela kukhishwa kwetici",
        feature_stats: "Buka kuba khona nehlatiya lesistimu",
        feature_tech_news: "Hlala ubuke imikhuba yebuchwepheshe",
        view_projects: "Buka Tiprojekthi",
        view_tasks: "Buka Imisebenti",
        view_updates: "Buka Tibuyekezo",
        view_all_updates: "Buka Tonkhe Tibuyekezo",
        nav_laptops: "Emalaphu",
        attendance_leave: "Kuphila & Ekhefwini",
        performance_tracker: "Kulandzelela Kusebenta",
        nav_settings: "Tilingiselelo",
        chat_support: "Lusito Lokukhuluma",
        welcome_title: "Wamukelwa!",
        section_updates: "Tibuyekezo",
        recent_activity: "Umlando Wemisebenti Yamuva (Emalanga Lesikhombisa)",
        add_task: "ENGETA UMSEBENZI",
        leave: "EKHEFWINI"
    },
    
    ve: {
        // Application
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Bveledziso ya Phurojekthi yo Vhanganywa 2026",
        logged_in_as: "No dzhena sa:",
        clock_in: "DZHENA TSHIFHINGA",
        clock_out: "FHA HLA TSHA",
        profile: "MBUMBO",
        logout: "FHA HLA",
        
        // Footer Navigation
        tech_news: "Mafhungo a Thekhinolodzhi",
        statistics: "Mbalombalo",
        settings: "Zwi thomiwa",
        suggestions: "Ma themendelo",
        recycle_bin: "Mugomo wa u Laha",
        developer_credit: "Yo bveledzwa nga ProspenTech.",
        all_rights_reserved: "Pfanelo dzothe dzo vhofholowa.",
        
        // Language names
        english: "Lu英语",
        afrikaans: "Luafurika",
        zulu: "Luzulu",
        xhosa: "Luxhosa",
        nso: "Lupedi",
        sesotho: "Lusuthu",
        tswana: "Lutswana",
        ndebele: "Lundebele",
        swati: "Luswati",
        venda: "Luvenda",
        tsonga: "Lutsonga",
        
        // Dashboard sections
        quick_actions: "Zwithu zwa u Tavhanya",
        projects: "Phurojekthi",
        updates: "Khwiniso",
        tasks: "Mishumo",
        duties: "Mvelelo ya Tshumelo",
        clients: "Phurojekthi dza ProspenTech",
        meetings: "Minutshe ya musudaphanda wa IT",
        banners: "Mabannara e-imeyili",
        versions: "Bodo ya vheiseni",
        admin: "Ndangulo ya vhashumisi",
        welcome_message: "Ni a tambelelwa {name}, ni na mishumo {count} i no khou lindela.",
        no_updates: "A hu na khwiniso",
        post_update: "Phosvola Khwiniso",
        view_all: "Sedza Zwoṱhe",
        
        // Project related
        project_name: "Dzina la Phurojekthi",
        project_lead: "Mutshimbidzi wa Phurojekthi",
        project_status: "Vhuimo",
        project_type: "Mufuta",
        start_date: "Duvha la u Thoma",
        due_date: "Duvha la u Fhedza",
        description: "Taluswa",
        team_members: "Mirado ya Tshigwada",
        tasks: "Mishumo",
        budget: "Mbadelo",
        notes: "Ndivhonotesi",
        add_project: "Engedza Phurojekthi",
        edit_project: "Fhindula Phurojekthi",
        delete_project: "Bvisa Phurojekthi",
        confirm_delete: "Khwathisedza u Bvisa",
        
        // Task related
        task_title: "Thaithili ya Mushumo",
        assigned_to: "U awelwa kha",
        priority: "Ndeme",
        due_date: "Duvha la u Fhedza",
        status: "Vhuimo",
        add_task: "Engedza Mushumo",
        edit_task: "Fhindula Mushumo",
        delete_task: "Bvisa Mushumo",
        mark_complete: "Nanga u Fhedza",
        
        // Priority levels
        urgent: "U thusa",
        high: "Nṱha",
        medium: "Vhukati",
        low: "Fhasi",
        normal: "Zwa misi",
        important: "Ya ndeme",
        
        // Status
        in_progress: "I khou ya phanda",
        completed: "Yo fhedza",
        pending: "I khou lindela",
        on_hold: "Yo dzudzanywa",
        cancelled: "Yo fhungudzwa",
        active: "I khou shuma",
        inactive: "A i shumi",
        
        // Clocking
        clock_in: "DZHENA TSHIFHINGA",
        clock_out: "FHA HLA TSHA",
        clocked_in: "Wo dzhena tshifhinga",
        clocked_out: "Wo fha hla tsha",
        on_time: "Nga tshifhinga",
        late: "U sa fhedzi",
        early: "Matsheloni",
        hours_worked: "Awara dzine dza Shuma",
        
        // Statistics
        total_projects: "Phurojekthi dzothe",
        total_tasks: "Mishumo yothe",
        total_updates: "Khwiniso dzothe",
        total_users: "Vhashumisi vothe",
        active_users: "Vhashumisi vhare khou shuma",
        overdue_tasks: "Mishumo yo no fhira tshifhinga",
        completion_rate: "Tshivhalo tsha u Fhedza",
        
        // Buttons
        save: "Sevha",
        cancel: "Fhungudza",
        delete: "Bvisa",
        edit: "Fhindula",
        add: "Engedza",
        close: "Vala",
        confirm: "Khwathisedza",
        back: "Hulisa",
        
        // Messages
        success: "Zwo bvelela",
        error: "Vhukhakhi",
        warning: "Ndivho",
        info: "Mafhungo",
        loading: "I khou laisha...",
        no_data: "A hu na data",
        are_you_sure: "Ni na vhutanzi?",
        action_cannot_be_undone: "Tshitshelo itshi a tshi nga tudwea.",
        
        // Time
        today: "Namusi",
        this_week: "Vhege ino",
        this_month: "Nwedzi uno",
        this_year: "Nwaha uno",
        days_remaining: "Matsheloni o salaho",
        overdue: "Yo fhira tshifhinga",
        due_today: "I fhedza Namusi!",
        
        // User roles
        administrator: "Muhashulusi",
        team_member: "Mutara wa Tshigwada",
        project_lead: "Mutshimbidzi wa Phurojekthi",
        
        // Features
        feature_projects: "Tevhela phurojekthi dzothe dza IT na mbonalo",
        feature_tasks: "Langula mishumo na u abela",
        feature_updates: "Ruma na u sedza khwiniso dza tshigwada",
        feature_duties: "Talutshedza zwithu na vhudifhinduleli ha tshigwada",
        feature_kpis: "Tevhela zwiambaro zwa ndeme zwa tshumelo",
        feature_clients: "Langula zwine zwa todwa kha phurojekthi ya mutengi",
        feature_meetings: "Nwala minutshe ya musudaphanda wa IT",
                feature_banners: "Tevhela u abelwa ha mabannara e-imeyili",
        feature_versions: "Rula u bviswa ha zwiimo",
        feature_stats: "Sedza vhudzulo na u saukanya ha sisiteme",
        feature_tech_news: "Dzula no sedza ndila dza thekhinolodzhi",
        view_projects: "Vhona Zwiphrojeke",
        view_tasks: "Vhona Mishumo",
        view_updates: "Vhona Zwidzengi",
        view_all_updates: "Vhona Zwidzengi Zwose",
        nav_laptops: "Zwikhomphiyutha",
        attendance_leave: "U Swika na U Shumula",
        performance_tracker: "Muvhigo wa Mushumo",
        nav_settings: "Zwithu zwa u Ita",
        chat_support: "Thuso ya Vhaisani",
        welcome_title: "Khou Ambiwa!",
        section_updates: "Zwidzengi",
        recent_activity: "Mafhungo a Mishumo (Maduvha a 7)",
        add_task: "ENGEDZA MUSHUMO",
        leave: "U SHUMULA"
    },
    
    ts: {
        // Application
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Nxaxamelo wa Phurojeke lowu Hlanganisiweke 2026",
        logged_in_as: "U nghenile tani hi:",
        clock_in: "NGENA NKARHA",
        clock_out: "HUMA NKARHENI",
        profile: "XITIVO",
        logout: "HUMA",
        
        // Footer Navigation
        tech_news: "Mahungu ya Thekinoloji",
        statistics: "Nhlayhelo",
        settings: "Masungulo",
        suggestions: "Switsundzuxo",
        recycle_bin: "Xitulu Xa Kuhlaya",
        developer_credit: "Yi endliwe hi ProspenTech.",
        all_rights_reserved: "Timfanelo hinkwato ti hlayisiwile.",
        
        // Language names
        english: "Xinghezi",
        afrikaans: "Xibhunu",
        zulu: "Xizulu",
        xhosa: "Xixhosa",
        nso: "Xipedi",
        sesotho: "Xisuthu",
        tswana: "Xitswana",
        ndebele: "Xindebele",
        swati: "Xiswati",
        venda: "Xivenda",
        tsonga: "Xitsonga",
        
        // Dashboard sections
        quick_actions: "Swendleko Leswi Hatlisaka",
        projects: "Tipurojeke",
        updates: "Vuhundzuluxi",
        tasks: "Mitirho",
        duties: "Xivumbeko xa Matirhele",
        clients: "Tipurojeke ta ProspenTech",
        meetings: "Timinete ta Nkomiso wa IT",
        banners: "Mabhanara ya imeyili",
        versions: "Bodo ya Vuhundzuluxi",
        admin: "Vulawuri bya Vatirhisi",
        welcome_message: "U amukeriwile {name}, u na mitirho {count} leyi rindziweke.",
        no_updates: "A ku na vuhundzuluxi",
        post_update: "Rhumerisa Vuhundzuluxi",
        view_all: "Vona Hinkwaswo",
        
        // Project related
        project_name: "Vito ra Purojeke",
        project_lead: "Mutshami wa Purojeke",
        project_status: "Xiyimo",
        project_type: "Muxaka",
        start_date: "Siku ro Sungula",
        due_date: "Siku ro Humesa",
        description: "Nhlayoxo",
        team_members: "Swirho swa Xipano",
        tasks: "Mitirho",
        budget: "Mbangu",
        notes: "Switshovo",
        add_project: "Engeta Purojeke",
        edit_project: "Lulamisa Purojeke",
        delete_project: "Susa Purojeke",
        confirm_delete: "Tiyisisa ku Susa",
        
        // Task related
        task_title: "Nhlokomhaka wa Ntirho",
        assigned_to: "Averiwe eka",
        priority: "Nkoka",
        due_date: "Siku ro Humesa",
        status: "Xiyimo",
        add_task: "Engeta Ntirho",
        edit_task: "Lulamisa Ntirho",
        delete_task: "Susa Ntirho",
        mark_complete: "Fanele ku Hetisela",
        
        // Priority levels
        urgent: "Hi xihatla",
        high: "Ehenhla",
        medium: "Xikarhi",
        low: "Ehansi",
        normal: "Nkarhi wun'wana",
        important: "Xa nkoka",
        
        // Status
        in_progress: "Ku ya emahlweni",
        completed: "Ku hetisiwile",
        pending: "Ku rindzeriwe",
        on_hold: "Ku yimisiwile",
        cancelled: "Ku tshitshisiwile",
        active: "Ku tirha",
        inactive: "A ku tirhi",
        
        // Clocking
        clock_in: "NGENA NKARHA",
        clock_out: "HUMA NKARHENI",
        clocked_in: "U ngene nkarha",
        clocked_out: "U hume nkarheni",
        on_time: "Hi nkarhi",
        late: "Ku siwa hi nkarhi",
        early: "Eku sunguleni",
        hours_worked: "Tiawara Leti Tirheke",
        
        // Statistics
        total_projects: "Tipurojeke hinkwato",
        total_tasks: "Mitirho hinkwayo",
        total_updates: "Vuhundzuluxi hinkwabyo",
        total_users: "Vatirhisi hinkwavo",
        active_users: "Vatirhisi lava tirhaka",
        overdue_tasks: "Mitirho leyi hundzeke nkarhi",
        completion_rate: "Xipiko xa ku Hetisa",
        
        // Buttons
        save: "Hlayisa",
        cancel: "Tshitshisa",
        delete: "Susa",
        edit: "Lulamisa",
        add: "Engeta",
        close: "Pfala",
        confirm: "Tiyisisa",
        back: "Vuyela endzhaku",
        
        // Messages
        success: "Ku humelela",
        error: "Xihoxo",
        warning: "Xitshimbiriso",
        info: "Vuxokoxoko",
        loading: "Yi layicha...",
        no_data: "A ku na data leyi kumekaka",
        are_you_sure: "Xana wa tiyiseka?",
        action_cannot_be_undone: "Ntirho lowu a wu nge tlheli wu hleuriwa.",
        
        // Time
        today: "Namuntlha",
        this_week: "Vhiki leri",
        this_month: "N'hweti leyi",
        this_year: "Lembe leri",
        days_remaining: "Masiku lama Saleke",
        overdue: "Yi hundzeke nkarhi",
        due_today: "Yi fanele ku hetiwa Namuntlha!",
        
        // User roles
        administrator: "Mulawuri",
        team_member: "Xirho xa Xipano",
        project_lead: "Mutshami wa Purojeke",
        
        // Features
        feature_projects: "Landzelela tipurojeke hinkwato ta IT na ku endla",
        feature_tasks: "Lawula mitirho na ku averiwa hi ku kongoma",
        feature_updates: "Rhumerisa no vona vuhundzuluxi bya xipano",
        feature_duties: "Hlamusela swivangelo na vutihlamuleri bya xipano",
        feature_kpis: "Landzelela swikombiso swa ntirho leswi nkoka",
        feature_clients: "Lawula leswi lavekaka eka purojeke ya muxavi",
        feature_meetings: "Tsala timinete ta nkomiso wa IT",
        feature_banners: "Landzelela ku averiwa ka mabhanara ya imeyili",
        feature_versions: "Pulana ku humesiwa ka swiphemu",
        feature_stats: "Vona vukona na nxopaxopo wa sisteme",
        feature_tech_news: "Tshama u langutile maendlelo ya thekinoloji",
        view_projects: "Languta Swiphrojeke",
        view_tasks: "Languta Switirho",
        view_updates: "Languta Swibuyeriwa",
        view_all_updates: "Languta Swibuyeriwa Hinkwaswo",
        nav_laptops: "Swikhomphutha",
        attendance_leave: "Ku Tiva na Ku Siya",
        performance_tracker: "Mulandzisi wa Ntirho",
        nav_settings: "Swilungiselelo",
        chat_support: "Pfuneto ya Vurimi",
        welcome_title: "Xewelani!",
        section_updates: "Swibuyeriwa",
        recent_activity: "Matimu ya Ntirho (Masiku ya 7)",
        add_task: "ENGETELA NTIRHO",
        leave: "KU SIYA"
    }
};

let currentLanguage = localStorage.getItem('appLanguage') || 'en';

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('appLanguage', lang);
        applyTranslations();
        
        // Update language selector if it exists
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = lang;
        }
        
        // Update chatbot language if it's open
        if (window.nexaChatbot && window.nexaChatbot.userData) {
            window.nexaChatbot.userData.language = lang;
        }
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLanguage][key];
            } else if (element.tagName === 'OPTION') {
                element.textContent = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
    
    // Update document title if needed
    if (translations[currentLanguage] && translations[currentLanguage].app_title) {
        document.title = translations[currentLanguage].app_title;
    }
    
    // Update any dynamic content that needs translation
    updateTranslatedContent();
}

function updateTranslatedContent() {
    // Update welcome message if on dashboard
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage && window.auth && window.auth.getCurrentUser()) {
        const user = window.auth.getCurrentUser();
        const pendingTasks = window.getPendingTaskCount ? window.getPendingTaskCount() : 0;
        welcomeMessage.textContent = translations[currentLanguage].welcome_message
            .replace('{name}', user.username)
            .replace('{count}', pendingTasks);
    }
    
    // Update clock button text
    const clockBtn = document.getElementById('clockBtn');
    if (clockBtn) {
        const isClockedIn = clockBtn.classList.contains('clocked-in');
        clockBtn.innerHTML = isClockedIn ? 
            `<i class="fas fa-sign-out-alt"></i> ${translations[currentLanguage].clock_out}` : 
            `<i class="fas fa-sign-in-alt"></i> ${translations[currentLanguage].clock_in}`;
    }
    
    // Update profile button
    const profileBtn = document.querySelector('[onclick*="profile.html"]');
    if (profileBtn) {
        profileBtn.innerHTML = `<i class="fas fa-user"></i> ${translations[currentLanguage].profile}`;
    }
    
    // Update logout button
    const logoutBtn = document.querySelector('[onclick*="auth.logout"]');
    if (logoutBtn) {
        logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> ${translations[currentLanguage].logout}`;
    }
}

// Make functions available globally
window.setLanguage = setLanguage;
window.applyTranslations = applyTranslations;
window.updateTranslatedContent = updateTranslatedContent;

// Auto-apply translations when DOM is loaded
document.addEventListener('DOMContentLoaded', applyTranslations);

// Re-apply translations when theme changes (since theme might affect color scheme but not text)
document.addEventListener('themeChanged', applyTranslations);

export { translations, setLanguage, applyTranslations, currentLanguage };