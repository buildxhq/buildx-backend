// /lib/ai/voiceAgent.ts — AI Voice Command Interpreter

interface VoiceCommandResult {
  action: string;
  target?: string;
  message?: string;
  parsed?: Record<string, any>;
}

export async function interpretVoiceCommand(transcript: string, user: { id: string; role: string }): Promise<VoiceCommandResult> {
  const lower = transcript.toLowerCase();

  if (lower.includes('invite subs') || lower.includes('send invites')) {
    return {
      action: 'invite-subs',
      message: 'Routing to invite subcontractors.'
    };
  }

  if (lower.includes('run takeoff')) {
    return {
      action: 'start-takeoff',
      message: 'Starting AI takeoff engine.'
    };
  }

  if (lower.includes('create project')) {
    return {
      action: 'new-project',
      message: 'Launching project creation flow.'
    };
  }

  return {
    action: 'unknown',
    message: 'Sorry, I didn’t understand that command.',
    parsed: { transcript }
  };
}
