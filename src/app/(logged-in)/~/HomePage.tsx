'use client';

import {
    ActionIcon,
    Alert,
    AppShellMain,
    Badge,
    Button,
    Checkbox,
    ColorSwatch,
    ComboboxItem,
    Container,
    DefaultMantineColor,
    Divider,
    Group,
    Kbd,
    LoadingOverlay,
    Menu,
    Modal,
    Pagination,
    Pill,
    rem,
    Select,
    Table,
    TagsInput,
    TagsInputProps,
    Text,
    Textarea,
    TextInput,
    Title,
    Tooltip,
} from '@mantine/core';
import {
    IconAdjustments,
    IconEye,
    IconPencil,
    IconPlus,
    IconTrashFilled,
    IconX,
} from '@tabler/icons-react';
import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
} from '@radix-ui/react-icons';
import { User } from 'next-auth';
import React, {
    LegacyRef,
    useEffect,
    useRef,
    useState,
    useTransition,
} from 'react';
import { Tasks } from '@prisma/client';
import { modals } from '@mantine/modals';
import {
    randomId,
    useDisclosure,
    useHotkeys,
    usePagination,
} from '@mantine/hooks';
import { addTask, deleteTask, updateTask } from './actions';
import debounce from 'lodash.debounce';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';

interface HomePageProps {
    user: User;
    tasks: Tasks[];
}

interface StatusOptionsProps {
    label: string;
    icon: any;
}

interface FilterButtonProps<T> {
    value: T;
    dispatch: React.Dispatch<React.SetStateAction<T>>;
}

const statusOptions: StatusOptionsProps[] = [
    {
        label: 'Backlog',
        icon: QuestionMarkCircledIcon,
    },
    {
        label: 'Todo',
        icon: CircleIcon,
    },
    {
        label: 'In Progress',
        icon: StopwatchIcon,
    },
    {
        label: 'Done',
        icon: CheckCircledIcon,
    },
    {
        label: 'Cancelled',
        icon: CrossCircledIcon,
    },
];

const priorityOptions: StatusOptionsProps[] = [
    {
        label: 'Low',
        icon: ArrowDownIcon,
    },
    {
        label: 'Medium',
        icon: ArrowRightIcon,
    },
    {
        label: 'High',
        icon: ArrowUpIcon,
    },
];

function StatusFilterButton({ value, dispatch }: FilterButtonProps<string[]>) {
    return (
        <Menu
            shadow="md"
            width={250}
            closeOnItemClick={false}
            position="bottom-start"
        >
            <Menu.Target>
                <Button
                    variant="light"
                    color="gray"
                    radius="xl"
                    visibleFrom="md"
                >
                    <Group gap={'xs'}>
                        <IconPlus
                            style={{
                                width: rem(14),
                                height: rem(14),
                            }}
                        />
                        Status
                    </Group>
                    {!!value.length && (
                        <>
                            <Divider
                                orientation="vertical"
                                mx="sm"
                                variant="dashed"
                            />
                            <Pill.Group>
                                {value.length > 2 ? (
                                    <>
                                        <Pill c="yellow">
                                            {value.length} selected
                                        </Pill>
                                    </>
                                ) : (
                                    <>
                                        {value.map((status) => (
                                            <Pill c="yellow" key={status}>
                                                {status}
                                            </Pill>
                                        ))}
                                    </>
                                )}
                            </Pill.Group>
                        </>
                    )}
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                {statusOptions.map((statusOption) => (
                    <Menu.Item
                        key={statusOption.label}
                        onClick={() => {
                            dispatch(
                                value.includes(statusOption.label)
                                    ? value.filter(
                                          (status) =>
                                              status !== statusOption.label
                                      )
                                    : [...value, statusOption.label]
                            );
                        }}
                    >
                        <Group>
                            <Checkbox
                                color="yellow.5"
                                checked={value.includes(statusOption.label)}
                                onChange={() => {
                                    dispatch(
                                        value.includes(statusOption.label)
                                            ? value.filter(
                                                  (status) =>
                                                      status !==
                                                      statusOption.label
                                              )
                                            : [...value, statusOption.label]
                                    );
                                }}
                            />
                            <Group gap="4">
                                {statusOption.icon && <statusOption.icon />}
                                {statusOption.label}
                            </Group>
                        </Group>
                    </Menu.Item>
                ))}
                {!!value.length && (
                    <Menu.Item onClick={() => dispatch([])}>
                        Clear filter
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}

function PriorityFilterButton({
    value,
    dispatch,
}: FilterButtonProps<string[]>) {
    return (
        <Menu
            shadow="md"
            width={250}
            closeOnItemClick={false}
            position="bottom-start"
        >
            <Menu.Target>
                <Button
                    variant="light"
                    color="gray"
                    radius="xl"
                    visibleFrom="md"
                >
                    <Group gap={'xs'}>
                        <IconPlus
                            style={{
                                width: rem(14),
                                height: rem(14),
                            }}
                        />
                        Priority
                    </Group>
                    {!!value.length && (
                        <>
                            <Divider
                                orientation="vertical"
                                mx="sm"
                                variant="dashed"
                            />
                            <Pill.Group>
                                {value.length > 2 ? (
                                    <>
                                        <Pill c="yellow">
                                            {value.length} selected
                                        </Pill>
                                    </>
                                ) : (
                                    <>
                                        {value.map((priority) => (
                                            <Pill c="yellow" key={priority}>
                                                {priority}
                                            </Pill>
                                        ))}
                                    </>
                                )}
                            </Pill.Group>
                        </>
                    )}
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                {priorityOptions.map((priorityOption) => (
                    <Menu.Item
                        key={priorityOption.label}
                        onClick={() => {
                            dispatch(
                                value.includes(priorityOption.label)
                                    ? value.filter(
                                          (status) =>
                                              status !== priorityOption.label
                                      )
                                    : [...value, priorityOption.label]
                            );
                        }}
                    >
                        <Group>
                            <Checkbox
                                color="yellow.5"
                                checked={value.includes(priorityOption.label)}
                                onChange={() => {
                                    dispatch(
                                        value.includes(priorityOption.label)
                                            ? value.filter(
                                                  (status) =>
                                                      status !==
                                                      priorityOption.label
                                              )
                                            : [...value, priorityOption.label]
                                    );
                                }}
                            />
                            <Group gap="xs">
                                {priorityOption.icon && <priorityOption.icon />}
                                {priorityOption.label}
                            </Group>
                        </Group>
                    </Menu.Item>
                ))}
                {!!value.length && (
                    <Menu.Item onClick={() => dispatch([])}>
                        Clear filter
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}

const tagsOption: Record<
    string,
    { color: DefaultMantineColor; description: string }
> = {
    Bug: {
        color: '#d73a4a',
        description: "Something isn't working",
    },
    Documentation: {
        color: '#0076ca',
        description: 'Improvements or additions to documentation',
    },
    Enhancement: {
        color: '#a2eeef',
        description: 'New feature or request',
    },
    Planning: {
        color: '#fef2c0',
        description: 'Iteration plans and roadmapping',
    },
};

const renderTagsInputOptions: TagsInputProps['renderOption'] = ({ option }) => (
    <Group>
        <ColorSwatch color={tagsOption[option.value].color} size={35} />
        <div>
            <Text>{option.value}</Text>
            <Text size="xs" opacity={0.5}>
                {tagsOption[option.value].description}
            </Text>
        </div>
    </Group>
);

const markdownToJsxOverrides: MarkdownToJSX.Overrides | undefined = {
    Alert: {
        component: Alert,
    },
    Button: {
        component: Button,
    },
    Group: {
        component: Group,
    },
};

function MarkdownRenderer({ children }: { children: string }) {
    return (
        <Markdown
            options={{
                overrides: markdownToJsxOverrides,
            }}
        >
            {children}
        </Markdown>
    );
}

export default function HomePage({ user, tasks }: HomePageProps) {
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

    const [dataTasks, setDataTasks] = useState<Tasks[]>(tasks);

    const [opened, { open, close }] = useDisclosure(false);

    const [viewTaskId, setViewTaskId] = useState<number | null>();
    const [deleteTaskId, setDeleteTaskId] = useState<string>('');
    const [deleteTaskIdx, setDeleteTaskIdx] = useState<number | null>();
    const [openedDeleteTask, { open: openDeleteTask, close: closeDeleteTask }] =
        useDisclosure(false);

    const [taskIdx, setTaskIdx] = useState<number>(0);
    const [taskStatus, setTaskStatus] = useState<ComboboxItem | null>();
    const [openedEditTask, { open: openEditTask, close: closeEditTask }] =
        useDisclosure(false, {
            onOpen: () => {
                const task = dataTasks[taskIdx];

                setTitle(task.title);
                setDescription(task.description);
                setTaskTags(task.tags);
            },
            onClose: () => {
                setTaskTags([]);
                setPriorityTag(null);
                setTaskStatus(null);
                setTitle('');
                setDescription('');
            },
        });

    const [taskTags, setTaskTags] = useState<string[]>([]);
    const [priorityTag, setPriorityTag] = useState<ComboboxItem | null>();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [isPending, startTransition] = useTransition();

    const tags: string[] = ['Bug', 'Documentation', 'Enhancement', 'Planning'];
    const priorities: { label: string; value: string }[] = [
        {
            label: 'Low',
            value: '0',
        },
        {
            label: 'Medium',
            value: '1',
        },
        {
            label: 'High',
            value: '2',
        },
    ];
    const statuses: { label: string; value: string }[] = [
        {
            label: 'Backlog',
            value: '0',
        },
        {
            label: 'Todo',
            value: '1',
        },
        {
            label: 'In Progress',
            value: '2',
        },
        {
            label: 'Done',
            value: '3',
        },
        {
            label: 'Cancelled',
            value: '4',
        },
    ];

    const renderTags = (tag: string, key: any) => {
        return tagsOption[tag] ? (
            <Tooltip
                label={tagsOption[tag].description}
                position="top"
                radius="xl"
                key={key}
            >
                <Badge
                    variant="light"
                    color={`${tagsOption[tag].color}`}
                    size="sm"
                    radius="xl"
                >
                    {tag}
                </Badge>
            </Tooltip>
        ) : null;
    };

    const viewTask = (idx: number) => {
        const task = dataTasks[idx];
        const statusOption = statusOptions[task.status];
        const priorityOption = priorityOptions[task.priority];

        return modals.open({
            title: task.title ?? 'No Title',
            centered: true,
            children: (
                <>
                    <Table withTableBorder withColumnBorders>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th>Tags</Table.Th>
                                <Table.Td>
                                    {!!!task.tags.length && 'No tags'}
                                    <Group gap={3}>
                                        {task.tags.map((tag) =>
                                            renderTags(tag, tag)
                                        )}
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Status</Table.Th>
                                <Table.Td>
                                    <Group gap={3}>
                                        {statusOption.icon && (
                                            <statusOption.icon />
                                        )}
                                        {statusOption.label}
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Priority</Table.Th>
                                <Table.Td>
                                    <Group gap={3}>
                                        {priorityOption.icon && (
                                            <priorityOption.icon />
                                        )}
                                        {priorityOption.label}
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>

                    <Divider variant="dashed" my="xl" />
                    <HighlightedMarkdown>
                        {task.description}
                    </HighlightedMarkdown>
                    <Divider variant="dashed" my="xl" />

                    <Group justify="space-between">
                        <Button
                            color="red"
                            variant="light"
                            radius="xl"
                            onClick={() => {
                                modals.closeAll();
                                setDeleteTaskId(task.id);
                                setDeleteTaskIdx(idx);
                                openDeleteTask();
                            }}
                            leftSection={
                                <IconTrashFilled
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                        >
                            Delete
                        </Button>

                        <Button
                            color="yellow.5"
                            variant="light"
                            radius="xl"
                            onClick={() => modals.closeAll()}
                            leftSection={
                                <IconX
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                        >
                            Close
                        </Button>
                    </Group>
                </>
            ),
        });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        startTransition(async () => {
            await addTask(
                user.id ?? 'no-id',
                title,
                description,
                taskTags,
                priorityTag?.value ?? '0'
            );

            setTaskTags([]);
            setPriorityTag(null);
            setTitle('');
            setDescription('');
            close();
        });
    }

    async function handleUpdateSubmit(
        e: React.FormEvent<HTMLFormElement>,
        taskId: string
    ) {
        e.preventDefault();

        startTransition(async () => {
            await updateTask(
                user.id ?? 'no-id',
                taskId,
                title,
                description,
                taskTags,
                taskStatus?.value ?? '1',
                priorityTag?.value ?? '0'
            );

            setTaskTags([]);
            setPriorityTag(null);
            setTaskStatus(null);
            setTitle('');
            setDescription('');
            closeEditTask();
        });
    }

    async function handleDeleteClick(id: string) {
        startTransition(async () => {
            await deleteTask(id);
            closeDeleteTask();
        });
    }

    const doTaskFilter = (query: string) => {
        if (!query) return setDataTasks(tasks);

        const debouncedFilter = debounce(() => {
            setDataTasks(
                tasks.filter((task) =>
                    task.title.toLowerCase().includes(query.toLowerCase())
                )
            );
        }, 500);

        debouncedFilter();
    };

    useEffect(() => {
        const doStatusFilter = (query: string[]) => {
            if (!!!query.length) return setDataTasks(tasks);

            const statuses: Record<number, string> = {
                0: 'Backlog',
                1: 'Todo',
                2: 'In Progress',
                3: 'Done',
                4: 'Cancelled',
            };

            const filteredTasks = tasks.filter((task) =>
                query.includes(statuses[task.status])
            );
            setDataTasks(filteredTasks);
        };

        doStatusFilter(statusFilter);
    }, [statusFilter, tasks]);

    useEffect(() => {
        const doPriorityFilter = (query: string[]) => {
            if (!!!query.length) return setDataTasks(tasks);

            const priorities: Record<number, string> = {
                0: 'Low',
                1: 'Medium',
                2: 'High',
            };

            const filteredTasks = tasks.filter((task) =>
                query.includes(priorities[task.priority])
            );
            setDataTasks(filteredTasks);
        };

        doPriorityFilter(priorityFilter);
    }, [priorityFilter, tasks]);

    return (
        <AppShellMain>
            <Container>
                <Title order={2}>
                    Welcome,{' '}
                    <Title order={2} c="yellow" component="span">
                        {user.name}
                    </Title>
                    !
                </Title>
                <Text size="sm" c={'gray'}>
                    Here&apos;s your current tasks.
                </Text>

                <Group justify="space-between" mt={'xl'}>
                    {/* Filter */}
                    <Group>
                        <TextInput
                            placeholder="Filter tasks..."
                            radius="xl"
                            onChange={(e) => doTaskFilter(e.target.value)}
                        />

                        {/* Status filter */}
                        <StatusFilterButton
                            value={statusFilter}
                            dispatch={setStatusFilter}
                        />

                        {/* Priority filter */}
                        <PriorityFilterButton
                            value={priorityFilter}
                            dispatch={setPriorityFilter}
                        />
                    </Group>

                    <Modal
                        opened={opened}
                        onClose={close}
                        title="Add Task"
                        centered
                    >
                        <form onSubmit={handleSubmit}>
                            <TextInput
                                label="Title"
                                placeholder="Enter task title"
                                radius="md"
                                data-autofocus
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                            <Textarea
                                autosize
                                minRows={8}
                                maxRows={10}
                                label="Description"
                                placeholder="Enter task description"
                                radius="md"
                                mt="md"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />
                            <TagsInput
                                label="Tags"
                                placeholder="Choose tags"
                                radius="md"
                                mt="md"
                                data={tags.map((tag) => tag)}
                                renderOption={renderTagsInputOptions}
                                onChange={(value) => setTaskTags(value)}
                                value={taskTags}
                            />
                            <Select
                                label="Priority"
                                placeholder="Choose priority"
                                radius="md"
                                mt="md"
                                data={priorities.map((priority) => {
                                    return {
                                        label: priority.label,
                                        value: priority.value,
                                    };
                                })}
                                onChange={(_value, option) =>
                                    setPriorityTag(option)
                                }
                                value={priorityTag?.value ?? null}
                            />
                            <Button
                                fullWidth
                                color="yellow.5"
                                radius="xl"
                                onClick={() => modals.closeAll()}
                                mt="xl"
                                type="submit"
                                loading={isPending}
                            >
                                Add Task
                            </Button>
                        </form>
                    </Modal>

                    <Button
                        color="yellow.5"
                        radius="xl"
                        leftSection={
                            <IconPlus
                                style={{ width: rem(14), height: rem(14) }}
                            />
                        }
                        onClick={open}
                    >
                        Add Task
                    </Button>
                </Group>

                <Table.ScrollContainer minWidth={800} mih={350} h={350} mt="xl">
                    <Table
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        stickyHeader
                        stickyHeaderOffset={-4}
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th w={100}>Task</Table.Th>
                                <Table.Th w={250}>Title</Table.Th>
                                <Table.Th w={200}>Tags</Table.Th>
                                <Table.Th w={150}>Status</Table.Th>
                                <Table.Th w={150}>Priority</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {!!!dataTasks.length ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} align="center">
                                        Looks like there are no tasks to display
                                        yet! Why not add some tasks and get
                                        started?
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                dataTasks.map((task, id) => {
                                    const statusOption =
                                        statusOptions[task.status];
                                    const priorityOption =
                                        priorityOptions[task.priority];
                                    return (
                                        <React.Fragment key={task.id}>
                                            <Table.Tr>
                                                <Table.Td>TASK-{id}</Table.Td>
                                                <Table.Td>
                                                    {task.title}
                                                </Table.Td>
                                                <Table.Td>
                                                    {!!task.tags.length && (
                                                        <Group gap={3}>
                                                            {task.tags.map(
                                                                (tag) =>
                                                                    renderTags(
                                                                        tag,
                                                                        tag
                                                                    )
                                                            )}
                                                        </Group>
                                                    )}
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group gap={4}>
                                                        {statusOption.icon && (
                                                            <statusOption.icon />
                                                        )}
                                                        {statusOption.label}
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group gap={4}>
                                                        {priorityOption.icon && (
                                                            <priorityOption.icon />
                                                        )}
                                                        {priorityOption.label}
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Menu
                                                        width={150}
                                                        shadow="md"
                                                        position="bottom-end"
                                                    >
                                                        <Menu.Target>
                                                            <ActionIcon
                                                                variant="subtle"
                                                                aria-label="Task setting"
                                                                size="sm"
                                                                color="yellow.5"
                                                            >
                                                                <IconAdjustments
                                                                    style={{
                                                                        width: '70%',
                                                                        height: '70%',
                                                                    }}
                                                                />
                                                            </ActionIcon>
                                                        </Menu.Target>

                                                        <Menu.Dropdown>
                                                            <Menu.Item
                                                                onClick={() => {
                                                                    viewTask(
                                                                        id
                                                                    );
                                                                    setViewTaskId(
                                                                        id
                                                                    );
                                                                }}
                                                                leftSection={
                                                                    <IconEye
                                                                        style={{
                                                                            width: rem(
                                                                                14
                                                                            ),
                                                                            height: rem(
                                                                                14
                                                                            ),
                                                                        }}
                                                                    />
                                                                }
                                                            >
                                                                View
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                onClick={() => {
                                                                    setTaskIdx(
                                                                        id
                                                                    );
                                                                    openEditTask();
                                                                }}
                                                                leftSection={
                                                                    <IconPencil
                                                                        style={{
                                                                            width: rem(
                                                                                14
                                                                            ),
                                                                            height: rem(
                                                                                14
                                                                            ),
                                                                        }}
                                                                    />
                                                                }
                                                            >
                                                                Edit
                                                            </Menu.Item>

                                                            <Menu.Divider />
                                                            <Menu.Label>
                                                                Danger Zone
                                                            </Menu.Label>
                                                            <Menu.Item
                                                                color="red"
                                                                leftSection={
                                                                    <IconTrashFilled
                                                                        style={{
                                                                            width: rem(
                                                                                14
                                                                            ),
                                                                            height: rem(
                                                                                14
                                                                            ),
                                                                        }}
                                                                    />
                                                                }
                                                                onClick={() => {
                                                                    setDeleteTaskId(
                                                                        task.id
                                                                    );
                                                                    setDeleteTaskIdx(
                                                                        id
                                                                    );
                                                                    openDeleteTask();
                                                                }}
                                                            >
                                                                Delete
                                                            </Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                </Table.Td>
                                            </Table.Tr>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>

                {openedDeleteTask && (
                    <Modal
                        opened={openedDeleteTask}
                        onClose={closeDeleteTask}
                        title={`Delete TASK-${deleteTaskIdx}`}
                        centered
                        closeOnClickOutside={!isPending}
                        closeOnEscape={!isPending}
                        withCloseButton={!isPending}
                    >
                        <form
                            onSubmit={() => {
                                handleDeleteClick(deleteTaskId);
                            }}
                        >
                            <Text size="sm">
                                Are you sure you want to delete{' '}
                                <strong>TASK-{deleteTaskIdx}</strong>?
                            </Text>

                            <Group justify="end" mt="xl" gap={3}>
                                <Button
                                    radius="xl"
                                    onClick={() => {
                                        viewTaskId !== null &&
                                        deleteTaskIdx !== null
                                            ? viewTask(deleteTaskIdx!)
                                            : closeDeleteTask();
                                    }}
                                    disabled={isPending}
                                    color="gray.6"
                                >
                                    No
                                </Button>
                                <Button
                                    radius="xl"
                                    color="red"
                                    type="submit"
                                    data-autofocus
                                    disabled={isPending}
                                >
                                    {isPending ? 'Deleting...' : 'Yes'}
                                </Button>
                            </Group>
                        </form>
                    </Modal>
                )}

                {openedEditTask && (
                    <Modal
                        opened={openedEditTask}
                        onClose={closeEditTask}
                        title={`Edit TASK-${taskIdx}`}
                        centered
                    >
                        <form
                            onSubmit={(e) =>
                                handleUpdateSubmit(e, dataTasks[taskIdx].id)
                            }
                        >
                            <TextInput
                                label="Title"
                                placeholder="Enter task title"
                                radius="md"
                                data-autofocus
                                minLength={5}
                                maxLength={5}
                                onChange={(e) => setTitle(e.target.value)}
                                value={title ?? dataTasks[taskIdx].title}
                            />
                            <Textarea
                                autosize
                                minRows={5}
                                maxRows={8}
                                label="Description"
                                placeholder="Enter task description"
                                radius="md"
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={500}
                                value={
                                    description ??
                                    dataTasks[taskIdx].description
                                }
                            />
                            <TagsInput
                                label="Tags"
                                placeholder="Choose tags"
                                radius="md"
                                data={tags.map((tag) => tag)}
                                renderOption={renderTagsInputOptions}
                                onChange={(value) => setTaskTags(value)}
                                value={taskTags ?? dataTasks[taskIdx].tags}
                            />
                            <Select
                                label="Status"
                                placeholder="Update status"
                                radius="md"
                                data={statuses.map((status) => {
                                    return {
                                        label: status.label,
                                        value: status.value,
                                    };
                                })}
                                onChange={(_value, option) =>
                                    setTaskStatus(option)
                                }
                                value={
                                    taskStatus?.value ??
                                    `${dataTasks[taskIdx].status}`
                                }
                            />
                            <Select
                                label="Priority"
                                placeholder="Choose priority"
                                radius="md"
                                data={priorities.map((priority) => {
                                    return {
                                        label: priority.label,
                                        value: priority.value,
                                    };
                                })}
                                onChange={(_value, option) =>
                                    setPriorityTag(option)
                                }
                                value={
                                    priorityTag?.value ??
                                    `${dataTasks[taskIdx].priority}`
                                }
                            />
                            <Button
                                fullWidth
                                color="yellow.5"
                                radius="xl"
                                mt="xl"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? 'Updating task...' : 'Update Task'}
                            </Button>
                        </form>
                    </Modal>
                )}
            </Container>
        </AppShellMain>
    );
}

interface HighlightedMarkdownProps {
    children: string;
}

function HighlightedMarkdown({ children }: HighlightedMarkdownProps) {
    const rootRef = useRef<HTMLDivElement>();

    useEffect(() => {
        rootRef.current?.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block as HTMLElement);
        });
    }, [children]);

    return (
        <div ref={rootRef as LegacyRef<HTMLDivElement> | undefined}>
            <MarkdownRenderer>{children}</MarkdownRenderer>
        </div>
    );
}
