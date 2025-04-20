# append_failure_message.py
@service
def append_failure_message(message=None):
    if message is None:
        return
    failure_messages = state.get("input_text.failure_messages", "")
    if failure_messages:
        failure_messages += f", {message}"
    else:
        failure_messages = message
    state.set("input_text.failure_messages", failure_messages)
