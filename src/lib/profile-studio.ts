import { supabase } from './supabase';

export type ProfileStudioSettings = {
  backgroundColor: string;
  panelColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: number;
  borderWidth: number;
  shadow: string;
  pageWidth: number;
  contentAlignment: 'left' | 'center';
};

export type ProfileDesign = {
  user_id: string;
  preset: string;
  settings: ProfileStudioSettings;
  custom_css: string;
  custom_html: string;
  created_at?: string;
  updated_at?: string;
};

export const DEFAULT_PROFILE_STUDIO_SETTINGS: ProfileStudioSettings = {
  backgroundColor: '#f6f7f9',
  panelColor: '#ffffff',
  textColor: '#17191c',
  accentColor: '#e84d78',
  fontFamily: 'system',
  borderRadius: 18,
  borderWidth: 1,
  shadow: 'soft',
  pageWidth: 920,
  contentAlignment: 'center'
};

export const PROFILE_STUDIO_PRESETS = {
  clean: {
    name: 'Clean',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS
    }
  },

  y2k: {
    name: 'Y2K',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS,
      backgroundColor: '#dff3ff',
      accentColor: '#ff4fa3',
      borderRadius: 10,
      borderWidth: 2,
      shadow: 'strong'
    }
  },

  pink: {
    name: 'Pink Pop',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS,
      backgroundColor: '#fff0f5',
      accentColor: '#ed3e88',
      borderRadius: 24,
      borderWidth: 2
    }
  },

  dark: {
    name: 'Dark',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS,
      backgroundColor: '#111318',
      panelColor: '#1b1e25',
      textColor: '#f5f7fa',
      accentColor: '#ff6d9b',
      borderRadius: 16
    }
  },

  neon: {
    name: 'Neon',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS,
      backgroundColor: '#0b1020',
      panelColor: '#11182c',
      textColor: '#f5f7ff',
      accentColor: '#65f7ff',
      borderRadius: 12,
      borderWidth: 2,
      shadow: 'strong'
    }
  },

  romantic: {
    name: 'Romantic',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS,
      backgroundColor: '#fff7f8',
      accentColor: '#c95c79',
      borderRadius: 28
    }
  },

  retro: {
    name: 'Retro',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS,
      backgroundColor: '#f4ead7',
      panelColor: '#fffaf0',
      textColor: '#3f352b',
      accentColor: '#b85c38',
      borderRadius: 8,
      borderWidth: 2,
      shadow: 'strong'
    }
  },

  nature: {
    name: 'Nature',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS,
      backgroundColor: '#eef5ee',
      panelColor: '#ffffff',
      textColor: '#24372a',
      accentColor: '#4f8b5d',
      borderRadius: 20
    }
  },

  cyber: {
    name: 'Cyber',
    settings: {
      ...DEFAULT_PROFILE_STUDIO_SETTINGS,
      backgroundColor: '#08090d',
      panelColor: '#12141b',
      textColor: '#f1f3f8',
      accentColor: '#b56cff',
      borderRadius: 8,
      borderWidth: 2,
      shadow: 'strong'
    }
  }
} as const;

export async function getMyProfileDesign() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      design: null,
      error:
        userError ??
        new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('profile_designs')
    .select(
      'user_id, preset, settings, custom_css, custom_html, created_at, updated_at'
    )
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return {
      design: null,
      error
    };
  }

  const design: ProfileDesign | null = data
    ? {
        user_id: data.user_id,
        preset: data.preset,
        settings: {
          ...DEFAULT_PROFILE_STUDIO_SETTINGS,
          ...((data.settings ?? {}) as Partial<ProfileStudioSettings>)
        },
        custom_css: data.custom_css ?? '',
        custom_html: data.custom_html ?? '',
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    : null;

  return {
    design,
    error: null
  };
}

export async function getProfileDesign(userId: string) {
  const { data, error } = await supabase
    .from('profile_designs')
    .select(
      'user_id, preset, settings, custom_css, custom_html, created_at, updated_at'
    )
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return {
      design: null,
      error
    };
  }

  const design: ProfileDesign | null = data
    ? {
        user_id: data.user_id,
        preset: data.preset,
        settings: {
          ...DEFAULT_PROFILE_STUDIO_SETTINGS,
          ...((data.settings ?? {}) as Partial<ProfileStudioSettings>)
        },
        custom_css: data.custom_css ?? '',
        custom_html: data.custom_html ?? '',
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    : null;

  return {
    design,
    error: null
  };
}

export async function saveMyProfileDesign(
  preset: string,
  settings: ProfileStudioSettings,
  customCss: string,
  customHtml = ''
) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      design: null,
      error:
        userError ??
        new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('profile_designs')
    .upsert(
      {
        user_id: user.id,
        preset,
        settings,
        custom_css: customCss,
        custom_html: customHtml
      },
      {
        onConflict: 'user_id'
      }
    )
    .select()
    .single();

  return {
    design: data as ProfileDesign | null,
    error
  };
}